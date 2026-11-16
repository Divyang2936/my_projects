package com.causiva.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    protected UUID id;
    @Column(nullable = false)
    protected Instant createdAt;
    @Column(nullable = false)
    protected Instant updatedAt;

    @PrePersist
    void pre() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    void upd() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
