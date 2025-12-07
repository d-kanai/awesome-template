package com.example.demo.features.customer.auth.internal.application.command;

import com.example.demo.features.customer.user.expose.ExposedUser;
import com.example.demo.features.customer.user.expose.SignupUserApi;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 認証サインアップコマンド.
 *
 * <p>userモジュールのSignupUserApiを呼び出してユーザーを登録する。 DomainEvent/CommandEvent発行はuserモジュール内で完結する。
 */
@Service
@Transactional
public class SignupCommand {

  private final SignupUserApi signupUserApi;

  public SignupCommand(final SignupUserApi signupUserApi) {
    this.signupUserApi = signupUserApi;
  }

  public Output execute(final Input input) {
    final ExposedUser user = signupUserApi.execute(input.email(), input.password());
    return new Output(user);
  }

  public record Input(String email, String password) {}

  public record Output(ExposedUser user) {}
}
