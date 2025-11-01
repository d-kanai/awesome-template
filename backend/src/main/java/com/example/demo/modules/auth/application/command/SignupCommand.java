package com.example.demo.modules.auth.application.command;

import com.example.demo.modules.auth.presentation.input.SignupInput;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SignupCommand {
  private final UserRepository userRepository;

  public SignupCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User execute(final SignupInput input) {
    if (userRepository.existsByEmail(input.getEmail())) {
      throw new IllegalArgumentException("Email already exists: " + input.getEmail());
    }
    final User user = User.signup(input.getEmail(), input.getName());
    return userRepository.save(user);
  }
}
