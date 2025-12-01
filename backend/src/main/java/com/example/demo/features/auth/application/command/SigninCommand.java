package com.example.demo.features.auth.application.command;

import com.example.demo.features.auth.presentation.input.SigninInput;
import com.example.demo.features.auth.presentation.output.SigninOutput;
import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.repository.UserRepository;
import com.example.demo.features.user.domain.valueobject.UserEmail;
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

  public SigninOutput execute(final SigninInput input) {
    final User user =
        userRepository
            .findByEmail(input.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    // Simple password match check (no hashing for now)
    if (!user.getPassword().equals(input.getPassword())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    final String token =
        jwtTokenProvider.generateToken(user.getId(), UserEmail.of(user.getEmail()));

    return SigninOutput.from(user, token);
  }
}
