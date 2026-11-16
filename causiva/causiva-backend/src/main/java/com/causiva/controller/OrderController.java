package com.causiva.controller;

import com.causiva.dto.*;
import com.causiva.dto.OrderDtos.*;
import com.causiva.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    final OrderService s;

    public OrderController(OrderService s) {
        this.s = s;
    }

    UUID id(Authentication a) {
        return UUID.fromString(a.getName());
    }

    @PostMapping
    ResponseEntity<ApiResponse<OrderResponse>> create(Authentication a,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CreateOrderRequest x) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(s.create(id(a), idempotencyKey, x)));
    }

    @GetMapping
    ApiResponse<List<OrderResponse>> mine(Authentication a) {
        return ApiResponse.ok(s.mine(id(a)));
    }

    @GetMapping("/{orderNumber}")
    ApiResponse<OrderResponse> one(Authentication a, @PathVariable String orderNumber) {
        return ApiResponse.ok(s.one(id(a), orderNumber));
    }
}
