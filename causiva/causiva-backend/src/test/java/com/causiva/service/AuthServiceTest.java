package com.causiva.service;

import com.causiva.dto.AuthDtos.LoginRequest;
import com.causiva.dto.AuthDtos.RegisterRequest;
import com.causiva.entity.User;
import com.causiva.exception.ConflictException;
import com.causiva.exception.UnauthorizedException;
import com.causiva.repository.UserRepository;
import com.causiva.security.JwtService;
import com.causiva.security.RateLimitService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private UserRepository users;
    private PasswordEncoder encoder;
    private JwtService jwt;
    private RateLimitService limits;
    private AuthService service;

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        encoder = mock(PasswordEncoder.class);
        jwt = mock(JwtService.class);
        limits = mock(RateLimitService.class);
        service = new AuthService(users, encoder, jwt, limits);
    }

    @Test
    void registerCreatesLocalUserAndReturnsJwt() {
        RegisterRequest request = new RegisterRequest("User@Example.com", "password123", "Test", "User");
        when(users.findByEmailIgnoreCase("User@Example.com")).thenReturn(Optional.empty());
        when(encoder.encode("password123")).thenReturn("hashed-password");
        when(jwt.generate(any(User.class))).thenReturn("jwt-token");

        var response = service.register(request);

        assertEquals("jwt-token", response.token());
        assertEquals("user@example.com", response.user().email());
        verify(users).save(argThat(user ->
                "user@example.com".equals(user.getEmail())
                        && "hashed-password".equals(user.getPasswordHash())
                        && "Test".equals(user.getFirstName())
                        && "User".equals(user.getLastName())));
    }

    @Test
    void registerRejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("existing@example.com", "password123", "Test", null);
        when(users.findByEmailIgnoreCase("existing@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(ConflictException.class, () -> service.register(request));
        verify(users, never()).save(any());
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        User user = user();
        when(users.findByEmailIgnoreCase("customer@example.com")).thenReturn(Optional.of(user));
        when(encoder.matches("password123", "hashed-password")).thenReturn(true);
        when(jwt.generate(user)).thenReturn("jwt-token");

        var response = service.login(new LoginRequest("customer@example.com", "password123"));

        assertEquals("jwt-token", response.token());
        verify(limits).check(argThat(key -> key != null && key.startsWith("login:email:")), eq(10), eq(Duration.ofMinutes(15)));
    }

    @Test
    void loginRejectsUnknownEmail() {
        when(users.findByEmailIgnoreCase("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class,
                () -> service.login(new LoginRequest("missing@example.com", "password123")));
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = user();
        when(users.findByEmailIgnoreCase("customer@example.com")).thenReturn(Optional.of(user));
        when(encoder.matches("wrong-password", "hashed-password")).thenReturn(false);

        assertThrows(UnauthorizedException.class,
                () -> service.login(new LoginRequest("customer@example.com", "wrong-password")));
    }

    @Test
    void loginRejectsGoogleUserWithoutLocalPassword() {
        User user = user();
        user.setPasswordHash(null);
        when(users.findByEmailIgnoreCase("customer@example.com")).thenReturn(Optional.of(user));

        assertThrows(UnauthorizedException.class,
                () -> service.login(new LoginRequest("customer@example.com", "password123")));
    }

    @Test
    void toResponseMapsAllUserFields() {
        User user = user();

        var response = service.toResponse(user);

        assertEquals(user.getId(), response.id());
        assertEquals("customer@example.com", response.email());
        assertEquals("Test", response.firstName());
        assertEquals("Customer", response.lastName());
        assertEquals("LOCAL", response.provider());
        assertEquals("CUSTOMER", response.role());
        assertEquals(10, response.points());
        assertEquals(Instant.parse("2026-01-01T00:00:00Z"), response.createdAt());
    }

    private User user() {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(user, "createdAt", Instant.parse("2026-01-01T00:00:00Z"));
        ReflectionTestUtils.setField(user, "points", 10);
        user.setEmail("customer@example.com");
        user.setPasswordHash("hashed-password");
        user.setFirstName("Test");
        user.setLastName("Customer");
        return user;
    }
}
