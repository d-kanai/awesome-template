package com.example.demo.features.user.expose;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** 他モジュールからUserを検索するための公開API. */
@Service
public class FindUserByEmailApi {

  private final UserRepository userRepository;

  public FindUserByEmailApi(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Optional<ExposedUser> execute(final String email) {
    return userRepository.findByEmail(email).map(this::toExposedUser);
  }

  public boolean existsByEmail(final String email) {
    return userRepository.existsByEmail(email);
  }

  private ExposedUser toExposedUser(final User user) {
    return new ExposedUser(
        user.getId().getValue(),
        user.getEmail(),
        user.getPassword(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }
}
