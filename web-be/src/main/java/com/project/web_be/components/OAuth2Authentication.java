package com.project.web_be.components;

import com.project.web_be.entities.User;
import com.project.web_be.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2Authentication extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    @Lazy // Trì hoãn khởi tạo UserService để phá vỡ chu kỳ phụ thuộc
    private UserService userService;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            if (authentication.getPrincipal() instanceof OAuth2User oAuth2User) {
                User user = userService.processOAuthLogin(oAuth2User);
                String token = jwtTokenUtils.generateToken(user);
                response.sendRedirect("http://localhost:4200/login?token=" + token);
            } else {
                throw new ServletException("Authentication principal is not OAuth2User");
            }
        } catch (Exception e) {
            throw new ServletException("OAuth2 login failed: " + e.getMessage(), e);
        }
    }
}