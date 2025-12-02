package com.example.demo.features.auth.internal.application.query;

import com.example.demo.shared.jwt.JwtClaims;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  public Output execute() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    final JwtClaims claims = (JwtClaims) authentication.getPrincipal();
    return new Output(UUID.fromString(claims.userId()), claims.email());
  }

  public record Output(UUID userId, String email) {}
}
