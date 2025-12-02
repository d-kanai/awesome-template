package com.example.demo.features.user.internal.application.command;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.features.user.internal.domain.valueobject.UserId;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChangeEmailCommand {

  private final UserRepository userRepository;

  public ChangeEmailCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Output execute(final Input input) {
    final User user =
        userRepository
            .findById(UserId.fromString(input.userId()))
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

    final Optional<User> existing = userRepository.findByEmail(input.email());
    if (existing.isPresent() && !existing.get().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Email already exists");
    }

    final User updated = user.changeEmail(input.email());
    final User saved = userRepository.update(updated);
    return new Output(saved);
  }

  public record Input(String userId, String email) {}

  public record Output(User user) {}
}
