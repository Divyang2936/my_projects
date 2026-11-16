package com.causiva.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.*;
import java.util.*;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
        SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwt, RateLimitFilter rateLimit, OAuthSuccessHandler success,
            OAuthFailureHandler failure, @Value("${app.google.enabled:false}") boolean googleEnabled,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) throws Exception {
            http.csrf(c -> c.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
                    .cors(c -> c.configurationSource(cors(allowedOrigins)))
                .exceptionHandling(e -> e.authenticationEntryPoint((req, res, ex) -> {
                    res.setStatus(401);
                    res.setContentType("application/json");
                    res.getWriter().write(
                            "{\"success\":false,\"message\":\"Authentication required\",\"code\":\"UNAUTHORIZED\"}");
                }).accessDeniedHandler((req, res, ex) -> {
                    res.setStatus(403);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"success\":false,\"message\":\"Forbidden\",\"code\":\"FORBIDDEN\"}");
                })).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**", "/actuator/health").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/orders/**", "/api/account/**", "/api/users/**").authenticated()
                        .anyRequest().denyAll());
        if (googleEnabled) {
            http.oauth2Login(o -> o.successHandler(success).failureHandler(failure));
        }
        http.addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(rateLimit, JwtAuthFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource cors(@Value("${app.cors.allowed-origins}") String allowedOrigins) {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim).filter(origin -> !origin.isBlank()).toList());
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }
}
