package com.causiva.repository;

import com.causiva.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"items", "items.product"})
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByOrderNumberAndUserId(String number, UUID userId);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByUserIdAndIdempotencyKey(UUID userId, String idempotencyKey);
}
