package com.example.demo.features.admin.auth.internal.application.query;

import com.example.demo.features.admin.shared.security.AdminAuthContext;
import com.example.demo.features.featureflag.expose.FindAllFeatureFlagsQuery;
import com.example.demo.features.featureflag.expose.UserContext;
import com.example.demo.shared.config.AppProperties;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminFindMeQuery")
@Transactional(readOnly = true)
public class FindMeQuery {

  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;
  private final AppProperties appProperties;

  public FindMeQuery(
      final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery, final AppProperties appProperties) {
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
    this.appProperties = appProperties;
  }

  public Output execute() {
    final var claims = AdminAuthContext.getCurrentClaims();
    final var ctx = new UserContext(claims.userId(), claims.email(), appProperties.getEnv());
    final var featureFlags = findAllFeatureFlagsQuery.execute(ctx).flags();
    return new Output(UUID.fromString(claims.userId()), claims.email(), featureFlags);
  }

  public record Output(UUID adminId, String email, Map<String, Boolean> featureFlags) {}
}
