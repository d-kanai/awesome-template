package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.valueobject.UserId;
import com.example.demo.modules.user.presentation.input.UpdateUserProfileInput;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UpdateUserProfileCommand {
  private final UserRepository userRepository;

  public UpdateUserProfileCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User execute(final UserId id, final UpdateUserProfileInput input) {
    final User user =
        userRepository
            .findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

    if (!user.getEmail().equals(input.getEmail())
        && userRepository.existsByEmail(input.getEmail())) {
      throw new IllegalArgumentException("Email already exists: " + input.getEmail());
    }
    final User updatedUser = user.updateProfile(input.getEmail(), input.getPassword());
    return userRepository.save(updatedUser);
  }
}
