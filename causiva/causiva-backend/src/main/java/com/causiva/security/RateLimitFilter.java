package com.causiva.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService limits;

    public RateLimitFilter(RateLimitService limits) {
        this.limits = limits;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String ip = request.getRemoteAddr();

        try {
            if ("POST".equals(method) && "/api/auth/login".equals(path)) {
                limits.check("login:ip:" + ip, 20, Duration.ofMinutes(1));
            } else if ("POST".equals(method) && "/api/auth/register".equals(path)) {
                limits.check("register:ip:" + ip, 5, Duration.ofHours(1));
            } else if ("GET".equals(method) && ("/api/auth/google".equals(path)
                    || "/oauth2/authorization/google".equals(path)
                    || "/login/oauth2/code/google".equals(path))) {
                limits.check("oauth:ip:" + ip, 20, Duration.ofMinutes(1));
            } else if ("POST".equals(method) && "/api/orders".equals(path)) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String subject = authentication != null && authentication.isAuthenticated()
                        ? authentication.getName()
                        : "ip:" + ip;
                limits.check("orders:" + subject, 30, Duration.ofMinutes(1));
            }
        } catch (RateLimitExceededException exception) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Too many requests\",\"code\":\"RATE_LIMITED\"}");
            return;
        } catch (RedisUnavailableException exception) {
            response.setStatus(503);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Security service unavailable\",\"code\":\"SECURITY_SERVICE_UNAVAILABLE\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}
