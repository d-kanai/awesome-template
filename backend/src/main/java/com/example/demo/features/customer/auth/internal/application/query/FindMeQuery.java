package com.example.demo.features.customer.auth.internal.application.query;

import com.example.demo.shared.security.customer.CustomerAuthContext;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  public Output execute() {
    final var claims = CustomerAuthContext.getCurrentClaims();
    return new Output(UUID.fromString(claims.userId()), claims.email());
  }

  public record Output(UUID userId, String email) {}
}
