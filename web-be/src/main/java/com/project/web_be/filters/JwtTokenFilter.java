package com.project.web_be.filters;

import com.project.web_be.components.JwtTokenUtils;
import com.project.web_be.entities.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor

public class JwtTokenFilter extends OncePerRequestFilter {
    @Value("${api.prefix}")
    private String apiPrefix;
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtil;
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            if(isBypassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }
            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }
            final String token = authHeader.substring(7);
            final String email = jwtTokenUtil.extractEmail(token);
            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userDetails = (User) userDetailsService.loadUserByUsername(email);
                if(jwtTokenUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
            filterChain.doFilter(request, response);
        }catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }

    }
    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of(String.format("%s/users/register", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/login", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/available-roles", apiPrefix), "GET"),
                Pair.of(String.format("%s/users/switch-role", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/current-role", apiPrefix), "GET"),
                Pair.of(String.format("%s/users/roles", apiPrefix), "GET"),
                Pair.of(String.format("%s/users/add-role", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/remove-role", apiPrefix), "DELETE"),
                Pair.of(String.format("%s/users/encode", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/**", apiPrefix), "GET"),
                Pair.of(String.format("%s/ws/**", apiPrefix), "GET"),
                Pair.of(String.format("%s/ws/**", apiPrefix), "POST"),
                Pair.of("/ws/**", "GET"),
                Pair.of("/ws", "GET"),
                Pair.of("/ws/**", "POST"),
                Pair.of("/uploads/", "GET"),
                Pair.of("/api/v1/exam-activity", "GET"),
                Pair.of("/api/v1/chat", "POST")
        );

        String requestPath = request.getServletPath();
        String requestMethod = request.getMethod();

        for (Pair<String, String> bypassToken : bypassTokens) {
            if (requestPath.contains(bypassToken.getFirst())
                    && requestMethod.equals(bypassToken.getSecond())) {
                System.out.println("Request Path: " + requestPath + ", Method: " + requestMethod);
                return true;
            }
        }
//        String requestPath = request.getServletPath();
//        String requestMethod = request.getMethod();
//
//        for (Pair<String, String> bypassToken : bypassTokens) {
//            if (requestPath.equals(bypassToken.getFirst()) && requestMethod.equals(bypassToken.getSecond())) {
//                System.out.println("Bypass token for Path: " + requestPath + ", Method: " + requestMethod);
//                return true;
//            }
//        }

        return false;
    }
}