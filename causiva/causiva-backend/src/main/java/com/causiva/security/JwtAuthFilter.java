package com.causiva.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwt;

    public JwtAuthFilter(JwtService j) {
        jwt = j;
    }

    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String token = null;
        if (req.getCookies() != null)
            for (Cookie c : req.getCookies())
                if ("CAUSIVA_TOKEN".equals(c.getName()))
                    token = c.getValue();
        if (token != null && jwt.valid(token)) {
            try {
                var claims = jwt.decode(token);
                UUID userId = UUID.fromString(claims.getSubject());
                String role = claims.getClaimAsString("role");
                if (role == null || role.isBlank()) throw new IllegalArgumentException("Missing role claim");
                var a = new UsernamePasswordAuthenticationToken(userId.toString(), null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                SecurityContextHolder.getContext().setAuthentication(a);
            } catch (Exception ignored) {
            }
        }
        chain.doFilter(req, res);
    }
}
