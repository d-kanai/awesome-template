package com.example.demo.shared.jwt;

import com.example.demo.features.user.domain.valueobject.UserEmail;
import com.example.demo.features.user.domain.valueobject.UserId;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  private final SecretKey secretKey;
  private final long expirationHours;

  public JwtTokenProvider(
      @Value("${jwt.secret:my-secret-key-that-is-at-least-256-bits-long-for-hs256}") String secret,
      @Value("${jwt.expiration-hours:24}") long expirationHours) {
    this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationHours = expirationHours;
  }

  public String generateToken(final UserId userId, final UserEmail email) {
    final Instant now = Instant.now();
    final Instant expiration = now.plus(expirationHours, ChronoUnit.HOURS);

    final JwtClaims claims =
        new JwtClaims(
            userId.getValue().toString(), email.getValue(), Date.from(now), Date.from(expiration));

    return generateToken(claims);
  }

  public String generateToken(final JwtClaims claims) {
    return Jwts.builder()
        .subject(claims.userId())
        .claim("email", claims.email())
        .issuedAt(claims.issuedAt())
        .expiration(claims.expiration())
        .signWith(secretKey)
        .compact();
  }

  /**
   * Validates the JWT token.
   *
   * @param token The JWT token to validate.
   * @return true if the token is valid, false otherwise.
   */
  public boolean validateToken(final String token) {
    try {
      Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  /**
   * Extracts user ID from JWT token.
   *
   * @param token The JWT token.
   * @return The user ID from the token's subject claim.
   */
  public String getUserIdFromToken(final String token) {
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
   * Extracts JwtClaims from JWT token.
   *
   * @param token The JWT token.
   * @return The JwtClaims object containing all claims.
   */
  public JwtClaims getClaimsFromToken(final String token) {
    final Claims claims =
        Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    return new JwtClaims(
        claims.getSubject(),
        claims.get("email", String.class),
        claims.getIssuedAt(),
        claims.getExpiration());
  }
}
