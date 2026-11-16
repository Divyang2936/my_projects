package com.causiva.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {
    @Column(nullable = false, unique = true)
    String slug;
    @Column(nullable = false)
    String name;
    String tagline;
    @Column(columnDefinition = "text")
    String description;
    @Column(nullable = false)
    BigDecimal price;
    @Column(name = "original_price", nullable = false)
    BigDecimal originalPrice;
    @Column(nullable = false)
    String volume;
    @Column(name = "image_url")
    String imageUrl;
    BigDecimal rating = BigDecimal.ZERO;
    @Column(name = "reviews_count")
    int reviewsCount;
    String badge;
    boolean active = true;
    int stock;

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getTagline() {
        return tagline;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public String getVolume() {
        return volume;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public int getReviewsCount() {
        return reviewsCount;
    }

    public String getBadge() {
        return badge;
    }

    public boolean isActive() {
        return active;
    }

    public int getStock() {
        return stock;
    }

    public void setSlug(String v) {
        slug = v;
    }

    public void setName(String v) {
        name = v;
    }

    public void setTagline(String v) {
        tagline = v;
    }

    public void setDescription(String v) {
        description = v;
    }

    public void setPrice(BigDecimal v) {
        price = v;
    }

    public void setOriginalPrice(BigDecimal v) {
        originalPrice = v;
    }

    public void setVolume(String v) {
        volume = v;
    }

    public void setImageUrl(String v) {
        imageUrl = v;
    }

    public void setRating(BigDecimal v) {
        rating = v;
    }

    public void setReviewsCount(int v) {
        reviewsCount = v;
    }

    public void setBadge(String v) {
        badge = v;
    }

    public void setActive(boolean v) {
        active = v;
    }

    public void setStock(int v) {
        stock = v;
    }
}
