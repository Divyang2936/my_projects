package com.causiva.controller;

import com.causiva.dto.*;
import com.causiva.dto.AddressDtos.*;
import com.causiva.dto.AuthDtos.ProfileUpdateRequest;
import com.causiva.service.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {
    final AccountService s;
    final AuthService auth;

    public AccountController(AccountService s, AuthService a) {
        this.s = s;
        auth = a;
    }

    UUID id(Authentication a) {
        return UUID.fromString(a.getName());
    }

    @GetMapping
    ApiResponse<com.causiva.dto.AuthDtos.UserResponse> me(Authentication a) {
        return ApiResponse.ok(s.me(id(a)));
    }

    @PutMapping
    ApiResponse<com.causiva.dto.AuthDtos.UserResponse> update(Authentication a,
            @Valid @RequestBody ProfileUpdateRequest x) {
        return ApiResponse.ok(s.update(id(a), x));
    }

    @GetMapping("/addresses")
    ApiResponse<List<AddressResponse>> addresses(Authentication a) {
        return ApiResponse.ok(s.addresses(id(a)));
    }

    @PostMapping("/addresses")
    ApiResponse<AddressResponse> add(Authentication a, @Valid @RequestBody AddressRequest x) {
        return ApiResponse.created(s.add(id(a), x));
    }
}
