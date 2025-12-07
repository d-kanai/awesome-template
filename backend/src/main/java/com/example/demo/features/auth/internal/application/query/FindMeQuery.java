package com.example.demo.features.auth.internal.application.query;

import com.example.demo.features.featureflags.expose.FindAllFeatureFlagsQuery;
import com.example.demo.shared.security.AuthContext;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;

  public FindMeQuery(final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery) {
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
  }

  public Output execute() {
    final var claims = AuthContext.getCurrentClaims();
    final var featureFlags = findAllFeatureFlagsQuery.execute().flags();
    return new Output(UUID.fromString(claims.userId()), claims.email(), featureFlags);
  }

  public record Output(UUID userId, String email, Map<String, Boolean> featureFlags) {}
}
