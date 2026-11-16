package com.causiva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    Order order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    Product product;
    @Column(name = "product_name")
    String productName;
    String volume;
    @Column(name = "unit_price")
    BigDecimal unitPrice;
    int quantity;

    public void setOrder(Order v) {
        order = v;
    }

    public void setProduct(Product v) {
        product = v;
    }

    public void setProductName(String v) {
        productName = v;
    }

    public void setVolume(String v) {
        volume = v;
    }

    public void setUnitPrice(BigDecimal v) {
        unitPrice = v;
    }

    public void setQuantity(int v) {
        quantity = v;
    }

    public UUID getProductId() {
        return product.getId();
    }

    public String getProductName() {
        return productName;
    }

    public String getVolume() {
        return volume;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }
}
