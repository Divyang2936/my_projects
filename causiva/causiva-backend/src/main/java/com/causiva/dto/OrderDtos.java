package com.causiva.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

public final class OrderDtos {
    private OrderDtos() {
    }

    public record OrderItemRequest(@NotNull UUID productId, @NotBlank String volume, @Min(1) @Max(20) int quantity) {
    }

    public record CreateOrderRequest(@NotEmpty List<@Valid OrderItemRequest> items,
            @NotBlank @Pattern(regexp = "(?i)upi|card|cod") String paymentMethod, @NotBlank @Email String email,
            @NotBlank String phone, @NotBlank String firstName, String lastName, @NotBlank String address,
            @NotBlank String city, @NotBlank String state, @NotBlank String pinCode) {
    }

    public record OrderItemResponse(UUID productId, String productName, String volume, BigDecimal unitPrice,
            int quantity) {
    }

        public record OrderResponse(UUID id, String orderNumber, String status, String paymentMethod, String paymentStatus, BigDecimal subtotal,
            BigDecimal shippingFee, BigDecimal total, String email, String phone, String firstName, String lastName,
            String address, String city, String state, String pinCode, Instant createdAt,
            List<OrderItemResponse> items) {
    }
}
