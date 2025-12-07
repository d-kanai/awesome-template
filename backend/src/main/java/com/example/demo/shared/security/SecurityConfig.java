package com.example.demo.shared.security;

import static com.example.demo.shared.constants.ApiPath.ADMIN;
import static com.example.demo.shared.constants.ApiPath.ADMIN_AUTH_SIGNIN;
import static com.example.demo.shared.constants.ApiPath.CUSTOMER;
import static com.example.demo.shared.constants.ApiPath.CUSTOMER_AUTH_SIGNIN;
import static com.example.demo.shared.constants.ApiPath.CUSTOMER_AUTH_SIGNUP;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.security.admin.AdminJwtFilter;
import com.example.demo.shared.security.customer.CustomerJwtFilter;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/** Spring Security configuration for JWT-based authentication. */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final CustomerJwtFilter customerJwtFilter;
  private final AdminJwtFilter adminJwtFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final AppProperties appProperties;

  public SecurityConfig(
      final CustomerJwtFilter customerJwtFilter,
      final AdminJwtFilter adminJwtFilter,
      final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
      final AppProperties appProperties) {
    this.customerJwtFilter = customerJwtFilter;
    this.adminJwtFilter = adminJwtFilter;
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    this.appProperties = appProperties;
  }

  /**
   * Configures the security filter chain for Customer APIs.
   *
   * @param http The HttpSecurity to configure.
   * @return The configured SecurityFilterChain.
   * @throws Exception if configuration fails.
   */
  @Bean
  @Order(1)
  public SecurityFilterChain customerFilterChain(final HttpSecurity http) throws Exception {
    http.securityMatcher(CUSTOMER + "/**")
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    // Customer public endpoints
                    .requestMatchers(CUSTOMER_AUTH_SIGNUP, CUSTOMER_AUTH_SIGNIN)
                    .permitAll()
                    // All other Customer endpoints require authentication
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(customerJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  /**
   * Configures the security filter chain for Admin APIs.
   *
   * @param http The HttpSecurity to configure.
   * @return The configured SecurityFilterChain.
   * @throws Exception if configuration fails.
   */
  @Bean
  @Order(2)
  public SecurityFilterChain adminFilterChain(final HttpSecurity http) throws Exception {
    http.securityMatcher(ADMIN + "/**")
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    // Admin public endpoints (signin only, no signup)
                    .requestMatchers(ADMIN_AUTH_SIGNIN)
                    .permitAll()
                    // All other Admin endpoints require authentication
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(adminJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  /**
   * Configures the security filter chain for common endpoints (health, docs, e2e).
   *
   * @param http The HttpSecurity to configure.
   * @return The configured SecurityFilterChain.
   * @throws Exception if configuration fails.
   */
  @Bean
  @Order(100)
  public SecurityFilterChain commonFilterChain(final HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(
            authorize ->
                authorize
                    // Common public endpoints
                    .requestMatchers("/actuator/health/**")
                    .permitAll()
                    .requestMatchers("/e2e/**")
                    .permitAll()
                    .requestMatchers("/v3/api-docs/**")
                    .permitAll()
                    .requestMatchers("/swagger-ui/**")
                    .permitAll()
                    .requestMatchers("/swagger-ui.html")
                    .permitAll()
                    // All other endpoints require authentication
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
        .addFilterBefore(customerJwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  /**
   * Configures CORS using AppProperties.
   *
   * @return The CORS configuration source.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    final CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(appProperties.getCors().getAllowedOrigins());
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
