package com.causiva.security;

import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RateLimitServiceTest {
    @Test
    void rejectsWhenRedisCounterExceedsLimit() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        when(redis.execute(any(RedisScript.class), anyList(), anyString())).thenReturn(4L);
        RateLimitService limits = new RateLimitService(redis);

        assertThrows(RateLimitExceededException.class,
                () -> limits.check("login:ip:test", 3, Duration.ofMinutes(1)));
    }

    @Test
    void failsClosedWhenRedisIsUnavailable() {
        StringRedisTemplate redis = mock(StringRedisTemplate.class);
        when(redis.execute(any(RedisScript.class), anyList(), anyString()))
                .thenThrow(new RuntimeException("redis unavailable"));
        RateLimitService limits = new RateLimitService(redis);

        assertThrows(RedisUnavailableException.class,
                () -> limits.check("register:ip:test", 5, Duration.ofHours(1)));
    }
}
