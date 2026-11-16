package com.causiva.security;

import com.causiva.entity.User;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;

class JwtServiceTest {
    private static final String SECRET = "test-secret-that-is-at-least-32-characters";

    @Test
    void rejectsTokenSignedByAnotherSecret() {
        User user = user();
        String token = new JwtService(SECRET, 120).generate(user);

        assertFalse(new JwtService("different-secret-that-is-at-least-32", 120).valid(token));
    }

    @Test
    void rejectsExpiredToken() {
        Instant now = Instant.now();
        var key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        var encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        var claims = JwtClaimsSet.builder().subject(user().getId().toString()).claim("role", "CUSTOMER")
            .issuedAt(now.minusSeconds(7200)).expiresAt(now.minusSeconds(3600)).build();
        String token = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();

        assertFalse(new JwtService(SECRET, 120).valid(token));
    }

    private User user() {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", UUID.randomUUID());
        user.setEmail("jwt-test@example.com");
        return user;
    }
}