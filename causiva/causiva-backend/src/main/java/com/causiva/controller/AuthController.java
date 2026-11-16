package com.causiva.controller;

import com.causiva.dto.*;
import com.causiva.dto.AuthDtos.*;
import com.causiva.service.AuthService;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.web.csrf.CsrfToken;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    final AuthService service;
    final boolean cookieSecure;
    final String cookieSameSite;

    public AuthController(AuthService s, @Value("${app.jwt.cookie-secure}") boolean cookieSecure,
            @Value("${app.jwt.cookie-same-site}") String cookieSameSite) {
        service = s;
        this.cookieSecure = cookieSecure;
        this.cookieSameSite = cookieSameSite;
    }

    @PostMapping("/register")
    ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest x) {
        TokenResponse token = service.register(x);
        return ResponseEntity.status(201).header(HttpHeaders.SET_COOKIE, authCookie(token.token()).toString())
            .body(ApiResponse.created(token.user()));
    }

    @PostMapping("/login")
    ResponseEntity<ApiResponse<UserResponse>> loginWithCookie(@Valid @RequestBody LoginRequest x) {
        TokenResponse token = service.login(x);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, authCookie(token.token()).toString())
                .body(ApiResponse.ok(token.user()));
    }

    private ResponseCookie authCookie(String token) {
        return ResponseCookie.from("CAUSIVA_TOKEN", token).httpOnly(true).secure(cookieSecure).path("/")
                .maxAge(java.time.Duration.ofHours(2)).sameSite(cookieSameSite).build();
    }

    @GetMapping("/google")
    void google(HttpServletResponse r) throws java.io.IOException {
        r.sendRedirect("/oauth2/authorization/google");
    }

    @PostMapping("/logout")
    ResponseEntity<Void> logout(HttpServletResponse r) {
        Cookie c = new Cookie("CAUSIVA_TOKEN", "");
        c.setHttpOnly(true);
        c.setSecure(cookieSecure);
        c.setAttribute("SameSite", cookieSameSite);
        c.setPath("/");
        c.setMaxAge(0);
        r.addCookie(c);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/csrf")
    ApiResponse<Void> csrf(CsrfToken token) {
        token.getToken();
        return ApiResponse.ok(null);
    }
}
