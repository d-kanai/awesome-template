package com.example.demo.features.customer.shared.security;

import com.example.demo.features.customer.shared.api.CustomerApiPath;
import com.example.demo.shared.security.JwtAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/** Customer API 用のセキュリティ設定. */
@Configuration
public class CustomerSecurityConfig {

  private static final String AUTH_SIGNUP = CustomerApiPath.BASE + "/auth/signup";
  private static final String AUTH_SIGNIN = CustomerApiPath.BASE + "/auth/signin";

  private final CustomerJwtFilter customerJwtFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final CorsConfigurationSource corsConfigurationSource;

  public CustomerSecurityConfig(
      final CustomerJwtFilter customerJwtFilter,
      final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
      final CorsConfigurationSource corsConfigurationSource) {
    this.customerJwtFilter = customerJwtFilter;
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    this.corsConfigurationSource = corsConfigurationSource;
  }

  /**
   * Customer API 用の SecurityFilterChain を設定する.
   *
   * @param http HttpSecurity
   * @return SecurityFilterChain
   * @throws Exception 設定エラー
   */
  @Bean
  @Order(1)
  public SecurityFilterChain customerFilterChain(final HttpSecurity http) throws Exception {
    http.securityMatcher(CustomerApiPath.BASE + "/**")
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    // Customer public endpoints
                    .requestMatchers(AUTH_SIGNUP, AUTH_SIGNIN)
                    .permitAll()
                    // All other Customer endpoints require authentication
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(customerJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
