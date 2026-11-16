package com.causiva.config;

import jakarta.servlet.http.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import java.io.IOException;

@Configuration
public class SecurityErrorConfig {
    public static void configure(HttpSecurity http) {
    }
}
