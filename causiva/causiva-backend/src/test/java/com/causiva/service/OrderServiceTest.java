package com.causiva.service;

import com.causiva.dto.OrderDtos.CreateOrderRequest;
import com.causiva.dto.OrderDtos.OrderItemRequest;
import com.causiva.entity.Product;
import com.causiva.entity.User;
import com.causiva.exception.ConflictException;
import com.causiva.exception.NotFoundException;
import com.causiva.repository.OrderRepository;
import com.causiva.repository.ProductRepository;
import com.causiva.repository.UserRepository;
import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.mockito.stubbing.Answer;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceTest {
    private static final UUID PRODUCT_ID = UUID.randomUUID();
    private static final UUID USER_ID = UUID.randomUUID();

    @Test
    void createsOrderWhenAtomicReservationSucceeds() {
        ProductRepository products = mock(ProductRepository.class);
        OrderService service = service(products);
        when(products.decrementStock(PRODUCT_ID, 2)).thenReturn(1);

        var response = service.create(USER_ID, request(2));

        assertEquals(BigDecimal.valueOf(598), response.total());
        verify(products).decrementStock(PRODUCT_ID, 2);
    }

    @Test
    void rejectsWhenAtomicReservationAffectsNoRows() {
        ProductRepository products = mock(ProductRepository.class);
        OrderService service = service(products);
        when(products.decrementStock(PRODUCT_ID, 2)).thenReturn(0);

        assertThrows(ConflictException.class, () -> service.create(USER_ID, request(2)));
        verify(products).decrementStock(PRODUCT_ID, 2);
    }

    @Test
    void rejectsInactiveProductBeforeReservation() {
        ProductRepository products = mock(ProductRepository.class);
        Product product = product(false, 10);
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        OrderService service = service(products, mock(OrderRepository.class), product);

        assertThrows(ConflictException.class, () -> service.create(USER_ID, request(1)));
        verify(products, never()).decrementStock(any(), anyInt());
    }

    @Test
    @Timeout(10)
    void concurrentReservationsCannotOversellStock() throws Exception {
        ProductRepository products = mock(ProductRepository.class);
        OrderRepository orders = mock(OrderRepository.class);
        OrderService service = service(products, orders);
        AtomicInteger remaining = new AtomicInteger(10);
        Answer<Integer> reservation = invocation -> remaining.getAndUpdate(stock -> stock > 0 ? stock - 1 : stock) > 0 ? 1 : 0;
        when(products.decrementStock(PRODUCT_ID, 1)).thenAnswer(reservation);

        ExecutorService executor = Executors.newFixedThreadPool(20);
        try {
            List<Future<Boolean>> attempts = java.util.stream.IntStream.range(0, 20)
                    .mapToObj(index -> executor.submit(() -> {
                        try {
                            service.create(USER_ID, request(1));
                            return true;
                        } catch (ConflictException e) {
                            return false;
                        }
                    })).toList();
            long successes = 0;
            for (Future<Boolean> attempt : attempts) {
                if (attempt.get()) successes++;
            }
            assertEquals(10, successes);
            assertEquals(0, remaining.get());
            verify(products, times(20)).decrementStock(PRODUCT_ID, 1);
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void rejectsZeroQuantityThroughBeanValidation() {
        assertTrue(Validation.buildDefaultValidatorFactory().getValidator().validate(request(0).items().get(0)).stream().anyMatch(error -> error.getPropertyPath().toString().equals("quantity")));
    }

    @Test
    void rejectsNegativeQuantityThroughBeanValidation() {
        assertTrue(Validation.buildDefaultValidatorFactory().getValidator().validate(request(-1).items().get(0)).stream().anyMatch(error -> error.getPropertyPath().toString().equals("quantity")));
    }

    @Test
    void orderLookupAlwaysScopesToAuthenticatedOwner() {
        ProductRepository products = mock(ProductRepository.class);
        OrderRepository orders = mock(OrderRepository.class);
        when(orders.findByOrderNumberAndUserId("CAUSIVA-000001", USER_ID)).thenReturn(Optional.empty());
        OrderService service = service(products, orders);

        assertThrows(NotFoundException.class, () -> service.one(USER_ID, "CAUSIVA-000001"));
        verify(orders).findByOrderNumberAndUserId("CAUSIVA-000001", USER_ID);
        verify(orders, never()).findById(any());
    }

    private OrderService service(ProductRepository products) {
        return service(products, mock(OrderRepository.class), product(true, 10));
    }

    private OrderService service(ProductRepository products, OrderRepository orders) {
        return service(products, orders, product(true, 10));
    }

    private OrderService service(ProductRepository products, OrderRepository orders, Product product) {
        UserRepository users = mock(UserRepository.class);
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(new User()));
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        return new OrderService(orders, products, users);
    }

    private Product product(boolean active, int stock) {
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(299));
        product.setOriginalPrice(BigDecimal.valueOf(299));
        product.setVolume("100ml");
        product.setActive(active);
        product.setStock(stock);
        return product;
    }

    private CreateOrderRequest request(int quantity) {
        return new CreateOrderRequest(List.of(new OrderItemRequest(PRODUCT_ID, "100ml", quantity)), "cod",
                "customer@example.com", "9999999999", "Test", "Customer", "Address", "City", "State", "000000");
    }
}