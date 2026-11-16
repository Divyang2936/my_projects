package com.causiva.service;

import com.causiva.dto.AuthDtos.*;
import com.causiva.entity.User;
import com.causiva.exception.*;
import com.causiva.repository.UserRepository;
import com.causiva.security.JwtService;
import com.causiva.security.RateLimitService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    final UserRepository repo;
    final PasswordEncoder encoder;
    final JwtService jwt;
    final RateLimitService limits;

    public AuthService(UserRepository r, PasswordEncoder e, JwtService j, RateLimitService limits) {
        repo = r;
        encoder = e;
        jwt = j;
        this.limits = limits;
    }

    public TokenResponse register(RegisterRequest x) {
        if (repo.findByEmailIgnoreCase(x.email()).isPresent())
            throw new ConflictException("Email already registered");
        User u = new User();
        u.setEmail(x.email().toLowerCase());
        u.setPasswordHash(encoder.encode(x.password()));
        u.setFirstName(x.firstName());
        u.setLastName(x.lastName());
        repo.save(u);
        return new TokenResponse(jwt.generate(u), toResponse(u));
    }

    public TokenResponse login(LoginRequest x) {
        limits.check("login:" + RateLimitService.normalizedEmailKey(x.email()), 10,
            java.time.Duration.ofMinutes(15));
        User u = repo.findByEmailIgnoreCase(x.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (u.getPasswordHash() == null || !encoder.matches(x.password(), u.getPasswordHash()))
            throw new UnauthorizedException("Invalid email or password");
        return new TokenResponse(jwt.generate(u), toResponse(u));
    }

    public UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getProvider().name(),
                u.getRole().name(), u.getPoints(), u.getCreatedAt());
    }
}
