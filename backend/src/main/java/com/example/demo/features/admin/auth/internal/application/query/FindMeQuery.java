package com.example.demo.features.admin.auth.internal.application.query;

import com.example.demo.shared.security.admin.AdminAuthContext;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminFindMeQuery")
@Transactional(readOnly = true)
public class FindMeQuery {

  public Output execute() {
    final var claims = AdminAuthContext.getCurrentClaims();
    return new Output(UUID.fromString(claims.userId()), claims.email());
  }

  public record Output(UUID adminId, String email) {}
}
