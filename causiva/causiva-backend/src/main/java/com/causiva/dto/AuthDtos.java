package com.causiva.dto;

import jakarta.validation.constraints.*;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Size(max = 100) String firstName, @Size(max = 100) String lastName) {
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {
    }

    public record ProfileUpdateRequest(@NotBlank @Size(max = 100) String firstName, @Size(max = 100) String lastName) {
    }

    public record UserResponse(java.util.UUID id, String email, String firstName, String lastName, String provider,
            String role, int points, java.time.Instant createdAt) {
    }

    public record TokenResponse(String token, UserResponse user) {
    }
}
