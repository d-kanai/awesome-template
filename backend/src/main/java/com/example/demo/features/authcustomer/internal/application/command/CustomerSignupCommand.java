package com.example.demo.features.authcustomer.internal.application.command;

import com.example.demo.features.authcustomer.internal.infrastructure.UserVerificationExternalApi;
import com.example.demo.features.authcustomer.internal.infrastructure.UserVerificationExternalApi.VerificationResponse;
import com.example.demo.features.user.expose.ExposedUser;
import com.example.demo.features.user.expose.SignupUserApi;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 認証サインアップコマンド.
 *
 * <p>userモジュールのSignupUserApiを呼び出してユーザーを登録する。 DomainEvent/CommandEvent発行はuserモジュール内で完結する。
 */
@Service
@Transactional
public class CustomerSignupCommand {

  private final SignupUserApi signupUserApi;
  private final UserVerificationExternalApi userVerificationExternalApi;

  public CustomerSignupCommand(
      final SignupUserApi signupUserApi,
      final UserVerificationExternalApi userVerificationExternalApi) {
    this.signupUserApi = signupUserApi;
    this.userVerificationExternalApi = userVerificationExternalApi;
  }

  public Output execute(final Input input) {
    // 外部APIでユーザー情報を検証 (失敗時は InfraLayerException がスローされる)
    final VerificationResponse verificationResponse =
        userVerificationExternalApi.execute(input.email(), "Sample User");

    // ユーザー登録処理
    final ExposedUser user = signupUserApi.execute(input.email(), input.password());
    return new Output(user, verificationResponse);
  }

  public record Input(String email, String password) {}

  public record Output(ExposedUser user, VerificationResponse verificationResponse) {}
}
