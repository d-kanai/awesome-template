package com.example.demo.modules.shared.jwt;

import com.example.demo.modules.user.domain.valueobject.UserEmail;
import com.example.demo.modules.user.domain.valueobject.UserId;
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
}
