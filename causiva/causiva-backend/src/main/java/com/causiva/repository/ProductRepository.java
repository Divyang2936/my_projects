package com.causiva.repository;

import com.causiva.entity.Product;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface ProductRepository extends JpaRepository<Product, UUID> {
        @Modifying(flushAutomatically = true)
        @Query("""
                        UPDATE Product p
                        SET p.stock = p.stock - :quantity
                        WHERE p.id = :productId
                            AND p.active = true
                            AND p.stock >= :quantity
                        """)
        int decrementStock(@Param("productId") UUID productId, @Param("quantity") int quantity);

    Optional<Product> findBySlugAndActiveTrue(String slug);

    List<Product> findByActiveTrueOrderByCreatedAtDesc();
}
