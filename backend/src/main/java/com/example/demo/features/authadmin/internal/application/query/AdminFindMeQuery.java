package com.example.demo.features.authadmin.internal.application.query;

import com.example.demo.features.featureflag.expose.FindAllFeatureFlagsQuery;
import com.example.demo.features.featureflag.expose.UserContext;
import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.security.admin.AdminAuthContext;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminFindMeQuery")
@Transactional(readOnly = true)
public class AdminFindMeQuery {

  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;
  private final AppProperties appProperties;

  public AdminFindMeQuery(
      final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery, final AppProperties appProperties) {
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
    this.appProperties = appProperties;
  }

  public Output execute() {
    final var principal = AdminAuthContext.getCurrentPrincipal();
    final var ctx = new UserContext(principal.userId(), principal.email(), appProperties.getEnv());
    final var featureFlags = findAllFeatureFlagsQuery.execute(ctx).flags();
    return new Output(UUID.fromString(principal.userId()), principal.email(), featureFlags);
  }

  public record Output(UUID adminId, String email, Map<String, Boolean> featureFlags) {}
}
