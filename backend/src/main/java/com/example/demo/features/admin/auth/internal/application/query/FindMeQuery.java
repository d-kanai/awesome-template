package com.example.demo.features.admin.auth.internal.application.query;

import com.example.demo.features.admin.shared.security.AdminAuthContext;
import com.example.demo.features.featureflags.expose.FindAllFeatureFlagsQuery;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminFindMeQuery")
@Transactional(readOnly = true)
public class FindMeQuery {

  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;

  public FindMeQuery(final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery) {
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
  }

  public Output execute() {
    final var claims = AdminAuthContext.getCurrentClaims();
    final var featureFlags = findAllFeatureFlagsQuery.executeForAdmin().flags();
    return new Output(UUID.fromString(claims.userId()), claims.email(), featureFlags);
  }

  public record Output(UUID adminId, String email, Map<String, Boolean> featureFlags) {}
}
