package com.causiva.security;

import com.causiva.entity.User;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.UUID;

@Service
public class JwtService {
    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final long expirationMinutes;

    public JwtService(@Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes) {
        if (secret.length() < 32)
            throw new IllegalArgumentException("JWT_SECRET must be at least 32 characters");
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        this.decoder = org.springframework.security.oauth2.jwt.NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256).build();
        this.expirationMinutes = expirationMinutes;
    }

    public String generate(User u) {
        Instant now = Instant.now();
        var claims = JwtClaimsSet.builder().subject(u.getId().toString()).claim("email", u.getEmail())
                .claim("role", u.getRole().name()).issuedAt(now)
                .expiresAt(now.plus(Duration.ofMinutes(expirationMinutes))).build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
                .getTokenValue();
    }

    public UUID userId(String token) {
        return UUID.fromString(decode(token).getSubject());
    }

    public Jwt decode(String token) {
        return decoder.decode(token);
    }

    public boolean valid(String token) {
        try {
            decoder.decode(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
