package com.example.demo.shared.security;

import com.example.demo.shared.config.AppProperties;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Spring Security 共通設定.
 *
 * <p>Actor固有のSecurityFilterChainは各feature内で定義される:
 *
 * <ul>
 *   <li>Customer: features/customer/auth/internal/infrastructure/CustomerSecurityConfig
 *   <li>Admin: features/admin/auth/internal/infrastructure/AdminSecurityConfig
 * </ul>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final AppProperties appProperties;

  public SecurityConfig(
      final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
      final AppProperties appProperties) {
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    this.appProperties = appProperties;
  }

  /**
   * 共通エンドポイント用 SecurityFilterChain.
   *
   * <p>/actuator/health/**, /e2e/**, /v3/api-docs/**, /swagger-ui/** などを許可する
   *
   * @param http HttpSecurity
   * @return SecurityFilterChain
   * @throws Exception 設定エラー
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
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint));

    return http.build();
  }

  /**
   * CORS設定.
   *
   * @return CorsConfigurationSource
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
