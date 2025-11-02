package com.example.demo.modules.shared.jwt;

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

  public String generateToken(final String userId, final String email) {
    final Instant now = Instant.now();
    final Instant expiration = now.plus(expirationHours, ChronoUnit.HOURS);

    return Jwts.builder()
        .subject(userId)
        .claim("email", email)
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiration))
        .signWith(secretKey)
        .compact();
  }
}
