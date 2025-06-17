package com.project.web_be.configurations;

import com.project.web_be.entities.Role;
import com.project.web_be.filters.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
//@EnableMethodSecurity
@EnableWebSecurity(debug = true)
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;
    @Value("${api.prefix}")
    private String apiPrefix;
    @Bean
    //Pair.of(String.format("%s/products", apiPrefix), "GET"),
    public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception{
        http
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {
                    requests
                            .requestMatchers(
                                    String.format("%s/users/register", apiPrefix),
                                    String.format("%s/users/login", apiPrefix),
                                    String.format("%s/ws/**", apiPrefix),
                                    String.format("%s/ws/**", apiPrefix),
                                    "ws/**"
                            )
                            .permitAll()
                            .requestMatchers(POST,
                                    String.format("%s/answer/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(DELETE,
                                    String.format("%s/answer**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/classes/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/classes/**", apiPrefix)).hasAnyAuthority(Role.STUDENT,Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/classes", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/classes/teacher/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(PUT,
                                    String.format("%s/classes/**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/assignments/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/assignments/class/**", apiPrefix)).hasAnyAuthority(Role.STUDENT,Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/assignments/teacher/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/assignments/**", apiPrefix)).hasAnyAuthority(Role.TEACHER,Role.STUDENT)
                            .requestMatchers(PUT,
                                    String.format("%s/assignments/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(DELETE,
                                    String.format("%s/assignments/**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/exams/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/exams/teacher/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/exams/**", apiPrefix)).hasAnyAuthority(Role.TEACHER,Role.STUDENT)
                            .requestMatchers(PUT,
                                    String.format("%s/exams/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(DELETE,
                                    String.format("%s/exams/**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/questions/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/questions/**", apiPrefix)).hasAnyAuthority(Role.TEACHER,Role.STUDENT)
                            .requestMatchers(PUT,
                                    String.format("%s/questions/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(DELETE,
                                    String.format("%s/questions/**", apiPrefix)).hasAnyAuthority(Role.TEACHER)

                            .requestMatchers(GET,
                                    String.format("%s/class/exams/**", apiPrefix)).hasAnyAuthority(Role.TEACHER,Role.STUDENT)
                            .requestMatchers(POST,
                                    String.format("%s/class/exams/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(PUT,
                                    String.format("%s/class/exams/**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/submissions/assignment", apiPrefix)).hasAuthority(Role.STUDENT)
                            .requestMatchers(GET,
                                    String.format("%s/submissions/status/**", apiPrefix)).hasAnyAuthority(Role.TEACHER,Role.STUDENT)
                            .requestMatchers(DELETE,
                                    String.format("%s/submissions/cancel/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(POST,
                                    String.format("%s/submissions/submit-exam", apiPrefix)).hasAnyAuthority(Role.STUDENT,Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/submissions/student/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/submissions/exam/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(GET,
                                    String.format("%s/submissions/**", apiPrefix)).hasAnyAuthority(Role.TEACHER, Role.STUDENT)

                            .requestMatchers(GET,
                                    String.format("%s/submissionAnswers", apiPrefix)).hasAnyAuthority(Role.STUDENT,Role.TEACHER)

                            .requestMatchers(POST,
                                    String.format("%s/enrollments/add", apiPrefix)).hasAuthority(Role.TEACHER)
                            .requestMatchers(POST,
                                    String.format("%s/enrollments/join", apiPrefix)).hasAuthority(Role.STUDENT)
                            .requestMatchers(GET,
                                    String.format("%s/enrollments/student/**", apiPrefix)).hasAuthority(Role.STUDENT)
                            .requestMatchers(GET,
                                    String.format("%s/enrollments/**", apiPrefix)).hasAuthority(Role.TEACHER)

                            .requestMatchers(GET,
                                    String.format("%s/scores/**", apiPrefix)).hasAuthority(Role.TEACHER)
                            .anyRequest().permitAll();
                    //.anyRequest().permitAll();

                })
                .csrf(AbstractHttpConfigurer::disable);
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                 configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });

        return http.build();
    }
}
