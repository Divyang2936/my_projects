package com.causiva.controller;

import com.causiva.dto.ApiResponse;
import com.causiva.dto.AuthDtos.ProfileUpdateRequest;
import com.causiva.dto.AuthDtos.UserResponse;
import com.causiva.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final AccountService accounts;

    public UserController(AccountService accounts) {
        this.accounts = accounts;
    }

    @PutMapping
    public ApiResponse<UserResponse> update(Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.ok(accounts.update(UUID.fromString(authentication.getName()), request));
    }
}