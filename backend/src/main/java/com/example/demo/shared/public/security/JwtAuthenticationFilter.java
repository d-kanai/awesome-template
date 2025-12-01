package com.example.demo.shared.security;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT authentication filter that validates tokens and sets authentication context. Supports both
 * Authorization header (Bearer token) and httpOnly Cookie authentication.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenProvider jwtTokenProvider;
  private final AppProperties appProperties;

  public JwtAuthenticationFilter(
      final JwtTokenProvider jwtTokenProvider, final AppProperties appProperties) {
    this.jwtTokenProvider = jwtTokenProvider;
    this.appProperties = appProperties;
  }

  @Override
  protected void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain)
      throws ServletException, IOException {

    // 1. Try to extract token from Authorization header (priority for frontend_native)
    String token = extractTokenFromHeader(request);

    // 2. If not found, try to extract token from Cookie (for frontend_web)
    if (token == null) {
      token = extractTokenFromCookie(request);
    }

    // 3. Validate token and set authentication context
    if (token != null && jwtTokenProvider.validateToken(token)) {
      // Extract claims from token
      final var claims = jwtTokenProvider.getClaimsFromToken(token);

      // Create authentication object with JwtClaims as principal
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
  private String extractTokenFromHeader(final HttpServletRequest request) {
    final String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * CookieからJWTトークンを抽出する.
   *
   * @param request HttpServletRequest
   * @return JWT token or null if not found
   */
  private String extractTokenFromCookie(final HttpServletRequest request) {
    final Cookie[] cookies = request.getCookies();
    if (cookies == null) {
      return null;
    }

    final String cookieName = appProperties.getJwt().getCookie().getName();
    return Arrays.stream(cookies)
        .filter(cookie -> cookieName.equals(cookie.getName()))
        .findFirst()
        .map(Cookie::getValue)
        .orElse(null);
  }
}
