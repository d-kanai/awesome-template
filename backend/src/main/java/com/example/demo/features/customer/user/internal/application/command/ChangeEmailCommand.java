package com.example.demo.features.customer.user.internal.application.command;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.exception.ApplicationLayerException;
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
    final User user = userRepository.findById(UserId.fromString(input.userId()));
    ensureEmailNotOwnedByAnother(input.email(), user);

    user.changeEmail(input.email());
    userRepository.update(user);

    return new Output(user);
  }

  private void ensureEmailNotOwnedByAnother(final String email, final User currentUser) {
    userRepository
        .findByEmail(email)
        .filter(existing -> !existing.getId().equals(currentUser.getId()))
        .ifPresent(
            existing -> {
              throw new ApplicationLayerException("Email already exists");
            });
  }

  public record Input(String userId, String email) {}

  public record Output(User user) {}
}
