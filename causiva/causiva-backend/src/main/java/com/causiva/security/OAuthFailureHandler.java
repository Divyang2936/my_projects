package com.causiva.security;

import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class OAuthFailureHandler implements AuthenticationFailureHandler {
    private final String frontend;

    public OAuthFailureHandler(@Value("${app.frontend-url}") String f) {
        frontend = f;
    }

    public void onAuthenticationFailure(HttpServletRequest r, HttpServletResponse s,
            org.springframework.security.core.AuthenticationException e) throws IOException {
        s.sendRedirect(frontend + "/login?error=google");
    }
}
