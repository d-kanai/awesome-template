package com.example.demo.shared.security.admin;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.jwt.AuthPrincipal;
import com.example.demo.shared.time.AppClock;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class AdminJwtTokenProvider {

  private final SecretKey secretKey;
  private final long expirationHours;

  public AdminJwtTokenProvider(final AppProperties appProperties) {
    // Admin uses the same secret but could be configured separately
    this.secretKey =
        Keys.hmacShaKeyFor(appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
    this.expirationHours = appProperties.getJwt().getExpirationHours();
  }

  public String generateToken(final String adminId, final String email) {
    final Instant now = AppClock.nowInstant();
    final Instant expiration = now.plus(expirationHours, ChronoUnit.HOURS);

    final AuthPrincipal principal =
        new AuthPrincipal(adminId, email, Date.from(now), Date.from(expiration));

    return generateToken(principal);
  }

  public String generateToken(final AuthPrincipal principal) {
    return Jwts.builder()
        .subject(principal.userId())
        .claim("email", principal.email())
        .claim("type", "admin")
        .issuedAt(principal.issuedAt())
        .expiration(principal.expiration())
        .signWith(secretKey)
        .compact();
  }

  /**
   * Validates the JWT token for admin.
   *
   * @param token The JWT token to validate.
   * @return true if the token is valid and is an admin token, false otherwise.
   */
  public boolean validateToken(final String token) {
    try {
      final Claims claims =
          Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
      final String type = claims.get("type", String.class);
      return "admin".equals(type);
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  /**
   * Extracts admin ID from JWT token.
   *
   * @param token The JWT token.
   * @return The admin ID from the token's subject claim.
   */
  public String getAdminIdFromToken(final String token) {
    final Claims claims =
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    return claims.getSubject();
  }

  /**
   * Extracts email from JWT token.
   *
   * @param token The JWT token.
   * @return The email from the token's email claim.
   */
  public String getEmailFromToken(final String token) {
    final Claims claims =
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    return claims.get("email", String.class);
  }

  /**
   * Extracts AuthPrincipal from JWT token.
   *
   * @param token The JWT token.
   * @return The AuthPrincipal object containing all claims.
   */
  public AuthPrincipal getPrincipalFromToken(final String token) {
    final Claims claims =
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    return new AuthPrincipal(
        claims.getSubject(),
        claims.get("email", String.class),
        claims.getIssuedAt(),
        claims.getExpiration());
  }
}
