package com.causiva.security;

import com.causiva.entity.User;
import com.causiva.repository.UserRepository;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {
    final UserRepository users;
    final JwtService jwt;
    final String frontend;
    final boolean secure;
    final String sameSite;

    public OAuthSuccessHandler(UserRepository u, JwtService j, @Value("${app.frontend-url}") String f,
            @Value("${app.jwt.cookie-secure}") boolean s,
            @Value("${app.jwt.cookie-same-site}") String sameSite) {
        users = u;
        jwt = j;
        frontend = f;
        secure = s;
        this.sameSite = sameSite;
    }

    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth)
            throws IOException {
        OAuth2User p = (OAuth2User) auth.getPrincipal();
        String email = p.getAttribute("email");
        String sub = p.getAttribute("sub");
        Boolean emailVerified = p.getAttribute("email_verified");
        String given = p.getAttribute("given_name");
        String family = p.getAttribute("family_name");
        if (!Boolean.TRUE.equals(emailVerified)) {
            res.sendRedirect(frontend + "/login?error=google");
            return;
        }
        User u = users.findByProviderAndProviderSubject(User.Provider.GOOGLE, sub)
                .orElseGet(() -> users.findByEmailIgnoreCase(email).orElse(null));
        if (u == null) {
            u = new User();
            u.setEmail(email);
            u.setFirstName(given == null ? "Causiva Customer" : given);
            u.setLastName(family);
            u.setProvider(User.Provider.GOOGLE);
            u.setProviderSubject(sub);
            users.save(u);
        } else if (u.getProvider() == User.Provider.LOCAL) {
            u.setProviderSubject(sub);
            users.save(u);
        }
        String token = jwt.generate(u);
        Cookie c = new Cookie("CAUSIVA_TOKEN", token);
        c.setHttpOnly(true);
        c.setSecure(secure);
        c.setAttribute("SameSite", sameSite);
        c.setPath("/");
        c.setMaxAge(60 * 60 * 2);
        res.addCookie(c);
        res.sendRedirect(frontend + "/account?login=success");
    }
}
