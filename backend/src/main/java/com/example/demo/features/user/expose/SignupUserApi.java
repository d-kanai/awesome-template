package com.example.demo.features.user.expose;

import com.example.demo.features.user.internal.application.command.SignupUserCommand;
import com.example.demo.features.user.internal.domain.model.User;
import org.springframework.stereotype.Service;

/**
 * 他モジュールからUserを作成するための公開API.
 *
 * <p>内部のSignupUserCommandを呼び出し、ExposedUserを返す。 DomainEvent/CommandEventの発行はSignupUserCommand内で行われる。
 */
@Service
public class SignupUserApi {

  private final SignupUserCommand signupUserCommand;

  public SignupUserApi(final SignupUserCommand signupUserCommand) {
    this.signupUserCommand = signupUserCommand;
  }

  public ExposedUser execute(final String email, final String password) {
    final SignupUserCommand.Output result =
        signupUserCommand.execute(new SignupUserCommand.Input(email, password));
    return toExposedUser(result.user());
  }

  private ExposedUser toExposedUser(final User user) {
    return new ExposedUser(
        user.getId().getValue(),
        user.getEmail(),
        user.getPassword(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }
}
