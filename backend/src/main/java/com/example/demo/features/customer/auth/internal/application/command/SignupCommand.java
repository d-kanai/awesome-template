package com.example.demo.features.customer.auth.internal.application.command;

import com.example.demo.features.customer.user.expose.ExposedUser;
import com.example.demo.features.customer.user.expose.SignupUserApi;
import com.example.demo.shared.infrastructure.externalapi.UserVerificationExternalApi;
import com.example.demo.shared.infrastructure.externalapi.UserVerificationExternalApi.VerificationResult;
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
  private final UserVerificationExternalApi userVerificationExternalApi;

  public SignupCommand(
      final SignupUserApi signupUserApi,
      final UserVerificationExternalApi userVerificationExternalApi) {
    this.signupUserApi = signupUserApi;
    this.userVerificationExternalApi = userVerificationExternalApi;
  }

  public Output execute(final Input input) {
    // 外部APIでユーザー情報を検証
    final VerificationResult verificationResult =
        userVerificationExternalApi.execute(input.email(), "Sample User");

    // ユーザー登録処理
    final ExposedUser user = signupUserApi.execute(input.email(), input.password());
    return new Output(user, verificationResult);
  }

  public record Input(String email, String password) {}

  public record Output(ExposedUser user, VerificationResult verificationResult) {}
}
