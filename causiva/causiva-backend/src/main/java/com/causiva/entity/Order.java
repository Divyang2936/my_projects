package com.causiva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    @Column(name = "order_number", nullable = false, unique = true)
    String orderNumber;
    @Column(name = "idempotency_key", length = 100)
    String idempotencyKey;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    User user;
    @Enumerated(EnumType.STRING)
    OrderStatus status = OrderStatus.PLACED;
    @Column(name = "payment_method")
    String paymentMethod;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    PaymentStatus paymentStatus = PaymentStatus.PENDING;
    BigDecimal subtotal, shippingFee, total;
    String email, phone;
    @Column(name = "first_name")
    String firstName;
    @Column(name = "last_name")
    String lastName;
    @Column(name = "address_line")
    String addressLine;
    String city, state;
    @Column(name = "pin_code")
    String pinCode;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItem> items = new ArrayList<>();

    public enum OrderStatus {
        PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }

    public enum PaymentStatus {
        PENDING, PENDING_COD, VERIFIED, FAILED
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public User getUser() {
        return user;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPinCode() {
        return pinCode;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setOrderNumber(String v) {
        orderNumber = v;
    }

    public void setIdempotencyKey(String v) {
        idempotencyKey = v;
    }

    public void setUser(User v) {
        user = v;
    }

    public void setStatus(OrderStatus v) {
        status = v;
    }

    public void setPaymentMethod(String v) {
        paymentMethod = v;
    }

    public void setPaymentStatus(PaymentStatus v) {
        paymentStatus = v;
    }

    public void setSubtotal(BigDecimal v) {
        subtotal = v;
    }

    public void setShippingFee(BigDecimal v) {
        shippingFee = v;
    }

    public void setTotal(BigDecimal v) {
        total = v;
    }

    public void setEmail(String v) {
        email = v;
    }

    public void setPhone(String v) {
        phone = v;
    }

    public void setFirstName(String v) {
        firstName = v;
    }

    public void setLastName(String v) {
        lastName = v;
    }

    public void setAddressLine(String v) {
        addressLine = v;
    }

    public void setCity(String v) {
        city = v;
    }

    public void setState(String v) {
        state = v;
    }

    public void setPinCode(String v) {
        pinCode = v;
    }
}
