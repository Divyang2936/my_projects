package com.causiva.dto;

import com.causiva.entity.Product;
import java.math.BigDecimal;
import java.util.UUID;

public final class ProductDtos {
    private ProductDtos() {
    }

    public record ProductResponse(UUID id, String name, String slug, String tagline, BigDecimal price,
            BigDecimal originalPrice, String volume, String imageUrl, BigDecimal rating, int reviewsCount, String badge,
            int stock) {
        public static ProductResponse of(Product p) {
            return new ProductResponse(p.getId(), p.getName(), p.getSlug(), p.getTagline(), p.getPrice(),
                    p.getOriginalPrice(), p.getVolume(), p.getImageUrl(), p.getRating(), p.getReviewsCount(),
                    p.getBadge(), p.getStock());
        }
    }
}
