package com.causiva.service;

import com.causiva.entity.Product;
import com.causiva.exception.NotFoundException;
import com.causiva.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {
    private ProductRepository products;
    private ProductService service;

    @BeforeEach
    void setUp() {
        products = mock(ProductRepository.class);
        service = new ProductService(products);
    }

    @Test
    void allReturnsOnlyRepositoryActiveProducts() {
        when(products.findByActiveTrueOrderByCreatedAtDesc()).thenReturn(List.of(product("serum", "Test Serum")));

        var result = service.all();

        assertEquals(1, result.size());
        assertEquals("serum", result.get(0).slug());
        assertEquals("Test Serum", result.get(0).name());
        verify(products).findByActiveTrueOrderByCreatedAtDesc();
    }

    @Test
    void allReturnsEmptyListWhenNoProductsExist() {
        when(products.findByActiveTrueOrderByCreatedAtDesc()).thenReturn(List.of());

        assertTrue(service.all().isEmpty());
    }

    @Test
    void bySlugReturnsMatchingActiveProduct() {
        Product product = product("serum", "Test Serum");
        when(products.findBySlugAndActiveTrue("serum")).thenReturn(Optional.of(product));

        var result = service.bySlug("serum");

        assertEquals("serum", result.slug());
        assertEquals("Test Serum", result.name());
        assertEquals(BigDecimal.valueOf(299), result.price());
    }

    @Test
    void bySlugRejectsMissingProduct() {
        when(products.findBySlugAndActiveTrue("missing")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.bySlug("missing"));
    }

    private Product product(String slug, String name) {
        Product product = new Product();
        ReflectionTestUtils.setField(product, "id", UUID.randomUUID());
        product.setSlug(slug);
        product.setName(name);
        product.setTagline("Daily skincare");
        product.setDescription("A test product");
        product.setPrice(BigDecimal.valueOf(299));
        product.setOriginalPrice(BigDecimal.valueOf(399));
        product.setVolume("100ml");
        product.setImageUrl("https://example.com/product.jpg");
        product.setRating(new BigDecimal("4.5"));
        product.setReviewsCount(25);
        product.setBadge("Best Seller");
        product.setActive(true);
        product.setStock(10);
        return product;
    }
}
