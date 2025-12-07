package com.example.demo.features.customer.user.internal.application.command;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChangePasswordCommand {

  private final UserRepository userRepository;

  public ChangePasswordCommand(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Output execute(final Input input) {
    final User user = userRepository.findById(UserId.fromString(input.userId()));
    verifyCurrentPassword(user, input.currentPassword());

    user.changePassword(input.newPassword());
    userRepository.update(user);

    return new Output(user);
  }

  private void verifyCurrentPassword(final User user, final String currentPassword) {
    if (!user.getPassword().equals(currentPassword)) {
      throw new ApplicationLayerException("Current password is incorrect");
    }
  }

  public record Input(String userId, String currentPassword, String newPassword) {}

  public record Output(User user) {}
}
