package com.causiva.service;

import com.causiva.dto.OrderDtos.CreateOrderRequest;
import com.causiva.dto.OrderDtos.OrderItemRequest;
import com.causiva.entity.Order;
import com.causiva.entity.Product;
import com.causiva.entity.User;
import com.causiva.exception.ConflictException;
import com.causiva.exception.NotFoundException;
import com.causiva.exception.UnauthorizedException;
import com.causiva.repository.OrderRepository;
import com.causiva.repository.ProductRepository;
import com.causiva.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceCoverageTest {
    private static final UUID USER_ID = UUID.randomUUID();
    private static final UUID PRODUCT_ID = UUID.randomUUID();
    private OrderRepository orders;
    private ProductRepository products;
    private UserRepository users;
    private OrderService service;

    @BeforeEach
    void setUp() {
        orders = mock(OrderRepository.class);
        products = mock(ProductRepository.class);
        users = mock(UserRepository.class);
        service = new OrderService(orders, products, users);
    }

    @Test
    void createRejectsMissingUser() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
                () -> service.create(USER_ID, "key", request(1, "100ml")));
    }

    @Test
    void createReturnsExistingIdempotentOrderWithoutStockChange() {
        User user = user();
        Order existing = order(user);
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user));
        when(orders.findByUserIdAndIdempotencyKey(USER_ID, "idem-key")).thenReturn(Optional.of(existing));

        var response = service.create(USER_ID, "idem-key", request(1, "100ml"));

        assertEquals(existing.getId(), response.id());
        verify(products, never()).findById(any());
        verify(products, never()).decrementStock(any(), anyInt());
    }

    @Test
    void createRejectsInvalidIdempotencyKeyLength() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user()));

        assertThrows(ConflictException.class,
                () -> service.create(USER_ID, "x".repeat(101), request(1, "100ml")));
    }

    @Test
    void createRejectsMissingProduct() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user()));
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.create(USER_ID, "key", request(1, "100ml")));
    }

    @Test
    void createRejectsInactiveProduct() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user()));
        Product product = product(false, "100ml");
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product));

        assertThrows(ConflictException.class,
                () -> service.create(USER_ID, "key", request(1, "100ml")));
        verify(products, never()).decrementStock(any(), anyInt());
    }

    @Test
    void createRejectsWrongVolume() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user()));
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product(true, "100ml")));

        assertThrows(ConflictException.class,
                () -> service.create(USER_ID, "key", request(1, "50ml")));
        verify(products, never()).decrementStock(any(), anyInt());
    }

    @Test
    void createCalculatesShippingForSubtotalBelowThreshold() {
        User user = user();
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user));
        when(orders.findByUserIdAndIdempotencyKey(any(), any())).thenReturn(Optional.empty());
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product(true, "100ml")));
        when(products.decrementStock(PRODUCT_ID, 1)).thenReturn(1);

        var response = service.create(USER_ID, "key", request(1, "100ml"));

        assertEquals(BigDecimal.valueOf(299), response.subtotal());
        assertEquals(BigDecimal.valueOf(60), response.shippingFee());
        assertEquals(BigDecimal.valueOf(359), response.total());
        assertEquals("PENDING_COD", response.paymentStatus());
    }

    @Test
    void createOffersFreeShippingAtOrAboveThreshold() {
        when(users.findWithLockById(USER_ID)).thenReturn(Optional.of(user()));
        when(orders.findByUserIdAndIdempotencyKey(any(), any())).thenReturn(Optional.empty());
        when(products.findById(PRODUCT_ID)).thenReturn(Optional.of(product(true, "100ml")));
        when(products.decrementStock(PRODUCT_ID, 2)).thenReturn(1);

        var response = service.create(USER_ID, "key", request(2, "100ml"));

        assertEquals(BigDecimal.valueOf(598), response.subtotal());
        assertEquals(BigDecimal.ZERO, response.shippingFee());
        assertEquals(BigDecimal.valueOf(598), response.total());
        assertEquals("PENDING_COD", response.paymentStatus());
    }

    @Test
    void mineReturnsOrdersForAuthenticatedUser() {
        Order order = order(user());
        when(orders.findByUserIdOrderByCreatedAtDesc(USER_ID)).thenReturn(List.of(order));

        var result = service.mine(USER_ID);

        assertEquals(1, result.size());
        assertEquals(order.getId(), result.get(0).id());
        verify(orders).findByUserIdOrderByCreatedAtDesc(USER_ID);
    }

    @Test
    void oneRejectsOrderFromAnotherUser() {
        when(orders.findByOrderNumberAndUserId("CAUSIVA-000001", USER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.one(USER_ID, "CAUSIVA-000001"));
    }

    private User user() {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", USER_ID);
        user.setEmail("customer@example.com");
        user.setFirstName("Test");
        user.setLastName("Customer");
        return user;
    }

    private Product product(boolean active, String volume) {
        Product product = new Product();
        ReflectionTestUtils.setField(product, "id", PRODUCT_ID);
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(299));
        product.setOriginalPrice(BigDecimal.valueOf(299));
        product.setVolume(volume);
        product.setActive(active);
        product.setStock(10);
        return product;
    }

    private Order order(User user) {
        Order order = new Order();
        ReflectionTestUtils.setField(order, "id", UUID.randomUUID());
        order.setUser(user);
        order.setOrderNumber("CAUSIVA-000001");
        order.setPaymentMethod("COD");
        order.setPaymentStatus(Order.PaymentStatus.PENDING_COD);
        order.setSubtotal(BigDecimal.valueOf(299));
        order.setShippingFee(BigDecimal.valueOf(60));
        order.setTotal(BigDecimal.valueOf(359));
        order.setEmail("customer@example.com");
        order.setPhone("9999999999");
        order.setFirstName("Test");
        order.setLastName("Customer");
        order.setAddressLine("Address");
        order.setCity("City");
        order.setState("State");
        order.setPinCode("380001");
        return order;
    }

    private CreateOrderRequest request(int quantity, String volume) {
        return new CreateOrderRequest(List.of(new OrderItemRequest(PRODUCT_ID, volume, quantity)), "cod",
                "customer@example.com", "9999999999", "Test", "Customer", "Address", "City", "State", "380001");
    }
}
