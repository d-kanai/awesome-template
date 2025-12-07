package com.example.demo.features.customer.user.internal.application.query;

import com.example.demo.features.customer.shared.security.CustomerAuthContext;
import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.features.featureflag.expose.FindAllFeatureFlagsQuery;
import com.example.demo.features.featureflag.expose.UserContext;
import com.example.demo.shared.config.AppProperties;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 現在ログイン中のユーザー情報を取得するクエリ. */
@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  private final UserRepository userRepository;
  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;
  private final AppProperties appProperties;

  public FindMeQuery(
      final UserRepository userRepository,
      final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery,
      final AppProperties appProperties) {
    this.userRepository = userRepository;
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
    this.appProperties = appProperties;
  }

  public Output execute() {
    final String currentUserId = CustomerAuthContext.getCurrentUserId();
    final String currentEmail = CustomerAuthContext.getCurrentEmail();
    final UserId userId = UserId.fromString(currentUserId);
    final User user = userRepository.findById(userId);
    if (user == null) {
      throw new IllegalStateException("User not found: " + userId);
    }
    final var ctx = new UserContext(currentUserId, currentEmail, appProperties.getEnv());
    final var featureFlags = findAllFeatureFlagsQuery.execute(ctx).flags();
    return new Output(user, featureFlags);
  }

  public record Output(User user, Map<String, Boolean> featureFlags) {}
}
