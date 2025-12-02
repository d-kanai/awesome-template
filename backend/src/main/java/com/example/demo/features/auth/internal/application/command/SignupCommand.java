package com.example.demo.features.auth.internal.application.command;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SignupCommand {

  private final UserRepository userRepository;

  public SignupCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Output execute(final Input input) {
    if (userRepository.existsByEmail(input.email())) {
      throw new ApplicationLayerException("Email already exists: " + input.email());
    }
    final User user = User.signup(input.email(), input.password());
    final User savedUser = userRepository.insert(user);
    return new Output(savedUser);
  }

  public record Input(String email, String password) {}

  public record Output(User user) {}
}
