package com.example.demo.shared.security.admin;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT authentication filter for Admin APIs. Validates tokens and sets authentication context.
 * Supports both Authorization header (Bearer token) and httpOnly Cookie authentication.
 */
@Component
public class AdminJwtFilter extends OncePerRequestFilter {

  private static final String ADMIN_COOKIE_NAME = "adminAccessToken";

  private final AdminJwtTokenProvider adminJwtTokenProvider;

  public AdminJwtFilter(final AdminJwtTokenProvider adminJwtTokenProvider) {
    this.adminJwtTokenProvider = adminJwtTokenProvider;
  }

  @Override
  protected void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain)
      throws ServletException, IOException {

    // 1. Try to extract token from Authorization header
    String token = extractTokenFromHeader(request);

    // 2. If not found, try to extract token from Cookie
    if (token == null) {
      token = extractTokenFromCookie(request);
    }

    // 3. Validate token and set authentication context
    if (token != null && adminJwtTokenProvider.validateToken(token)) {
      // Extract claims from token
      final var claims = adminJwtTokenProvider.getClaimsFromToken(token);

      // Create authentication object with JwtClaims as principal
      @SuppressWarnings("NullAway") // Spring Security accepts null for credentials and authorities
      final UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(claims, null, null);
      authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

      // Set authentication in security context
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    filterChain.doFilter(request, response);
  }

  /**
   * Authorization headerからBearerトークンを抽出する.
   *
   * @param request HttpServletRequest
   * @return JWT token or null if not found
   */
  private @Nullable String extractTokenFromHeader(final HttpServletRequest request) {
    final String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * CookieからAdmin用JWTトークンを抽出する.
   *
   * @param request HttpServletRequest
   * @return JWT token or null if not found
   */
  private @Nullable String extractTokenFromCookie(final HttpServletRequest request) {
    final Cookie[] cookies = request.getCookies();
    if (cookies == null) {
      return null;
    }

    return Arrays.stream(cookies)
        .filter(cookie -> ADMIN_COOKIE_NAME.equals(cookie.getName()))
        .findFirst()
        .map(Cookie::getValue)
        .orElse(null);
  }
}
