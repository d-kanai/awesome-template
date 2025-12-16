package com.example.demo.shared.security.customer;

import com.example.demo.shared.auth0.Auth0ClientInterface;
import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.jwt.AuthPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Auth0 token authentication filter for Customer APIs. Validates tokens via Auth0 /userinfo
 * endpoint and sets authentication context. Supports both Authorization header (Bearer token) and
 * httpOnly Cookie authentication.
 */
@Component
public class CustomerAuthFilter extends OncePerRequestFilter {

  private final Auth0ClientInterface auth0Client;
  private final AppProperties appProperties;

  public CustomerAuthFilter(
      final Auth0ClientInterface auth0Client, final AppProperties appProperties) {
    this.auth0Client = auth0Client;
    this.appProperties = appProperties;
  }

  @Override
  protected void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain)
      throws ServletException, IOException {

    final String token = extractToken(request);
    if (token != null) {
      authenticateWithToken(token, request);
    }
    filterChain.doFilter(request, response);
  }

  private @Nullable String extractToken(final HttpServletRequest request) {
    final String headerToken = extractTokenFromHeader(request);
    return headerToken != null ? headerToken : extractTokenFromCookie(request);
  }

  private void authenticateWithToken(final String token, final HttpServletRequest request) {
    final var userInfo = auth0Client.getUserInfo(token);
    if (userInfo == null) {
      return;
    }
    final var principal =
        new AuthPrincipal(userInfo.sub(), userInfo.email(), new Date(), new Date());

    @SuppressWarnings("NullAway") // Spring Security accepts null for credentials and authorities
    final UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(principal, null, null);
    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  /**
   * Authorization headerからBearerトークンを抽出する.
   *
   * @param request HttpServletRequest
   * @return Access token or null if not found
   */
  private @Nullable String extractTokenFromHeader(final HttpServletRequest request) {
    final String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Cookieからアクセストークンを抽出する.
   *
   * @param request HttpServletRequest
   * @return Access token or null if not found
   */
  private @Nullable String extractTokenFromCookie(final HttpServletRequest request) {
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
