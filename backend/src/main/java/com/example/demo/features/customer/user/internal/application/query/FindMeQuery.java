package com.example.demo.features.customer.user.internal.application.query;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.security.customer.CustomerAuthContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 現在ログイン中のユーザー情報を取得するクエリ. */
@Service
@Transactional(readOnly = true)
public class FindMeQuery {

  private final UserRepository userRepository;

  public FindMeQuery(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Output execute() {
    final UserId userId = UserId.fromString(CustomerAuthContext.getCurrentUserId());
    final User user = userRepository.findById(userId);
    if (user == null) {
      throw new IllegalStateException("User not found: " + userId);
    }
    return new Output(user);
  }

  public record Output(User user) {}
}
