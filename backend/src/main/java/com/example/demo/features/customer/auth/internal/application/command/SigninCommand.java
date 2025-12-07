package com.example.demo.features.customer.auth.internal.application.command;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.exception.ApplicationLayerException;
import com.example.demo.shared.security.customer.CustomerJwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SigninCommand {

  private final UserRepository userRepository;
  private final CustomerJwtTokenProvider customerJwtTokenProvider;

  public SigninCommand(
      final UserRepository userRepository,
      final CustomerJwtTokenProvider customerJwtTokenProvider) {
    this.userRepository = userRepository;
    this.customerJwtTokenProvider = customerJwtTokenProvider;
  }

  public Output execute(final Input input) {
    final User user =
        userRepository
            .findByEmail(input.email())
            .orElseThrow(() -> new ApplicationLayerException("Invalid email or password"));

    if (!user.getPassword().equals(input.password())) {
      throw new ApplicationLayerException("Invalid email or password");
    }

    final String token =
        customerJwtTokenProvider.generateToken(user.getId().getValue().toString(), user.getEmail());

    return new Output(user, token);
  }

  public record Input(String email, String password) {}

  public record Output(User user, String accessToken) {}
}
