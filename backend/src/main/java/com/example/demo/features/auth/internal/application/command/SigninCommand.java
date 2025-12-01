package com.example.demo.features.auth.internal.application.command;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.jwt.JwtTokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SigninCommand {

  private final UserRepository userRepository;
  private final JwtTokenProvider jwtTokenProvider;

  public SigninCommand(
      final UserRepository userRepository, final JwtTokenProvider jwtTokenProvider) {
    this.userRepository = userRepository;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  public Output execute(final Input input) {
    final User user =
        userRepository
            .findByEmail(input.email())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!user.getPassword().equals(input.password())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), user.getEmail());

    return new Output(user, token);
  }

  public record Input(String email, String password) {}

  public record Output(User user, String accessToken) {}
}
