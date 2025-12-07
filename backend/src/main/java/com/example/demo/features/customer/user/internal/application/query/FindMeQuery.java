package com.example.demo.features.customer.user.internal.application.query;

import com.example.demo.features.customer.shared.security.CustomerAuthContext;
import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.features.featureflags.expose.FindAllFeatureFlagsQuery;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 現在ログイン中のユーザー情報を取得するクエリ. */
@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  private final UserRepository userRepository;
  private final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery;

  public FindMeQuery(
      final UserRepository userRepository,
      final FindAllFeatureFlagsQuery findAllFeatureFlagsQuery) {
    this.userRepository = userRepository;
    this.findAllFeatureFlagsQuery = findAllFeatureFlagsQuery;
  }

  public Output execute() {
    final UserId userId = UserId.fromString(CustomerAuthContext.getCurrentUserId());
    final User user = userRepository.findById(userId);
    if (user == null) {
      throw new IllegalStateException("User not found: " + userId);
    }
    final var featureFlags = findAllFeatureFlagsQuery.execute().flags();
    return new Output(user, featureFlags);
  }

  public record Output(User user, Map<String, Boolean> featureFlags) {}
}
