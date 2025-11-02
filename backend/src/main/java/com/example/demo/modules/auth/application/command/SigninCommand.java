package com.example.demo.modules.auth.application.command;

import com.example.demo.modules.auth.presentation.input.SigninInput;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SigninCommand {
  private final UserRepository userRepository;

  public SigninCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User execute(final SigninInput input) {
    final User user =
        userRepository
            .findByEmail(input.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    // Simple password match check (no hashing for now)
    if (!user.getPassword().equals(input.getPassword())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    return user;
  }
}
