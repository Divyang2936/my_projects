package com.causiva.dto;

import jakarta.validation.constraints.*;
import java.util.UUID;

public final class AddressDtos {
    private AddressDtos() {
    }

    public record AddressRequest(@NotBlank String name, @NotBlank String address, @NotBlank String city,
            @NotBlank String state, @NotBlank String pinCode, @NotBlank String phone, boolean defaultAddress) {
    }

    public record AddressResponse(UUID id, String name, String address, String city, String state, String pinCode,
            String phone, boolean defaultAddress) {
    }
}
