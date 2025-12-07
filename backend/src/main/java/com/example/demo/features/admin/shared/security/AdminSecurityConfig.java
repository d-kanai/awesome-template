package com.example.demo.features.admin.shared.security;

import com.example.demo.features.admin.shared.api.AdminApiPath;
import com.example.demo.shared.security.JwtAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/** Admin API 用のセキュリティ設定. */
@Configuration
public class AdminSecurityConfig {

  private static final String AUTH_SIGNIN = AdminApiPath.BASE + "/auth/signin";

  private final AdminJwtFilter adminJwtFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final CorsConfigurationSource corsConfigurationSource;

  public AdminSecurityConfig(
      final AdminJwtFilter adminJwtFilter,
      final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
      final CorsConfigurationSource corsConfigurationSource) {
    this.adminJwtFilter = adminJwtFilter;
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    this.corsConfigurationSource = corsConfigurationSource;
  }

  /**
   * Admin API 用の SecurityFilterChain を設定する.
   *
   * @param http HttpSecurity
   * @return SecurityFilterChain
   * @throws Exception 設定エラー
   */
  @Bean
  @Order(2)
  public SecurityFilterChain adminFilterChain(final HttpSecurity http) throws Exception {
    http.securityMatcher(AdminApiPath.BASE + "/**")
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    // Admin public endpoints (signin only, no signup)
                    .requestMatchers(AUTH_SIGNIN)
                    .permitAll()
                    // All other Admin endpoints require authentication
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(adminJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
