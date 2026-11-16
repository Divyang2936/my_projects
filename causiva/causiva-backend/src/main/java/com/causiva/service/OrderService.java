package com.causiva.service;

import com.causiva.dto.OrderDtos.*;
import com.causiva.entity.*;
import com.causiva.exception.*;
import com.causiva.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.*;
import java.util.*;

@Service
public class OrderService {
    final OrderRepository orders;
    final ProductRepository products;
    final UserRepository users;

    public OrderService(OrderRepository o, ProductRepository p, UserRepository u) {
        orders = o;
        products = p;
        users = u;
    }

    public OrderResponse create(UUID uid, CreateOrderRequest x) {
        return create(uid, null, x);
    }

    @Transactional
    public OrderResponse create(UUID uid, String requestIdempotencyKey, CreateOrderRequest x) {
        User u = users.findWithLockById(uid).orElseThrow(() -> new UnauthorizedException("User not found"));
        String idempotencyKey = requestIdempotencyKey == null || requestIdempotencyKey.isBlank()
                ? UUID.randomUUID().toString()
                : requestIdempotencyKey.trim();
        if (idempotencyKey.length() > 100)
            throw new ConflictException("Invalid idempotency key");
        Optional<Order> existing = orders.findByUserIdAndIdempotencyKey(uid, idempotencyKey);
        if (existing.isPresent()) return map(existing.get());
        Order o = new Order();
        o.setUser(u);
        o.setIdempotencyKey(idempotencyKey);
        o.setOrderNumber("CAUSIVA-" + String.format("%06d", new Random().nextInt(1000000)));
        o.setStatus(Order.OrderStatus.PLACED);
        o.setPaymentMethod(x.paymentMethod().toUpperCase());
        o.setPaymentStatus("COD".equalsIgnoreCase(x.paymentMethod())
            ? Order.PaymentStatus.PENDING_COD : Order.PaymentStatus.PENDING);
        o.setEmail(x.email());
        o.setPhone(x.phone());
        o.setFirstName(x.firstName());
        o.setLastName(x.lastName());
        o.setAddressLine(x.address());
        o.setCity(x.city());
        o.setState(x.state());
        o.setPinCode(x.pinCode());
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest i : x.items()) {
            Product p = products.findById(i.productId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + i.productId()));
            if (!p.isActive())
                throw new ConflictException("Product is unavailable: " + p.getName());
            if (!p.getVolume().equals(i.volume()))
                throw new ConflictException("Invalid volume for " + p.getName());
            if (products.decrementStock(i.productId(), i.quantity()) != 1)
                throw new ConflictException("Insufficient stock for " + p.getName());
            BigDecimal unit = p.getPrice();
            OrderItem item = new OrderItem();
            item.setOrder(o);
            item.setProduct(p);
            item.setProductName(p.getName());
            item.setVolume(i.volume());
            item.setUnitPrice(unit);
            item.setQuantity(i.quantity());
            o.getItems().add(item);
            subtotal = subtotal.add(unit.multiply(BigDecimal.valueOf(i.quantity())));
        }
        BigDecimal threshold = BigDecimal.valueOf(499),
                shipping = subtotal.signum() > 0 && subtotal.compareTo(threshold) < 0 ? BigDecimal.valueOf(60)
                        : BigDecimal.ZERO;
        o.setSubtotal(subtotal);
        o.setShippingFee(shipping);
        o.setTotal(subtotal.add(shipping));
        orders.save(o);
        return map(o);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> mine(UUID uid) {
        return orders.findByUserIdOrderByCreatedAtDesc(uid).stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse one(UUID uid, String number) {
        return map(orders.findByOrderNumberAndUserId(number, uid)
                .orElseThrow(() -> new NotFoundException("Order not found")));
    }

    public OrderResponse map(Order o) {
        return new OrderResponse(o.getId(), o.getOrderNumber(), o.getStatus().name(), o.getPaymentMethod(),
            o.getPaymentStatus().name(),
                o.getSubtotal(), o.getShippingFee(), o.getTotal(), o.getEmail(), o.getPhone(), o.getFirstName(),
                o.getLastName(), o.getAddressLine(), o.getCity(), o.getState(), o.getPinCode(), o.getCreatedAt(),
                o.getItems().stream().map(i -> new OrderItemResponse(i.getProductId(), i.getProductName(),
                        i.getVolume(), i.getUnitPrice(), i.getQuantity())).toList());
    }
}
