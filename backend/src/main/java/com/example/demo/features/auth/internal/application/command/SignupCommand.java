package com.example.demo.features.auth.internal.application.command;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.event.EventPublisher;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SignupCommand {

  private final UserRepository userRepository;
  private final EventPublisher eventPublisher;

  public SignupCommand(final UserRepository userRepository, final EventPublisher eventPublisher) {
    this.userRepository = userRepository;
    this.eventPublisher = eventPublisher;
  }

  public Output execute(final Input input) {
    if (userRepository.existsByEmail(input.email())) {
      throw new ApplicationLayerException("Email already exists: " + input.email());
    }
    final User user = User.signup(input.email(), input.password());
    userRepository.insert(user);
    eventPublisher.publishAll(user.getDomainEvents());
    return new Output(user);
  }

  public record Input(String email, String password) {}

  public record Output(User user) {}
}
