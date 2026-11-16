package com.causiva.security;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;

@Service
public class RateLimitService {
    private static final DefaultRedisScript<Long> INCREMENT_SCRIPT = new DefaultRedisScript<>("""
            local current = redis.call('INCR', KEYS[1])
            if current == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
            return current
            """, Long.class);

    private final StringRedisTemplate redis;

    public RateLimitService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public void check(String key, int limit, Duration window) {
        final Long count;
        try {
            count = redis.execute(INCREMENT_SCRIPT, List.of("causiva:rate:" + key),
                    Long.toString(window.toMillis()));
        } catch (RuntimeException exception) {
            throw new RedisUnavailableException();
        }
        if (count == null) throw new RedisUnavailableException();
        if (count > limit) throw new RateLimitExceededException();
    }

    public static String normalizedEmailKey(String email) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(email.trim().toLowerCase().getBytes(StandardCharsets.UTF_8));
            return "email:" + HexFormat.of().formatHex(digest);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to normalize rate-limit key", exception);
        }
    }
}
