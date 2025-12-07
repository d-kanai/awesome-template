package com.example.demo.features.customer.auth.internal.application.command;

import com.example.demo.features.customer.user.expose.ExposedUser;
import com.example.demo.features.customer.user.expose.SignupUserApi;
import com.example.demo.shared.infrastructure.externalapi.UserVerificationService;
import com.example.demo.shared.infrastructure.externalapi.UserVerificationService.VerificationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

  private static final Logger logger = LoggerFactory.getLogger(SignupCommand.class);

  private final SignupUserApi signupUserApi;
  private final UserVerificationService userVerificationService;

  public SignupCommand(
      final SignupUserApi signupUserApi,
      final UserVerificationService userVerificationService) {
    this.signupUserApi = signupUserApi;
    this.userVerificationService = userVerificationService;
  }

  public Output execute(final Input input) {
    // 外部APIでユーザー情報を検証
    final VerificationResult verificationResult =
        userVerificationService.verify(input.email(), "Sample User");

    logger.info(
        "User verification result: email={}, verified={}, verificationId={}",
        input.email(),
        verificationResult.verified(),
        verificationResult.verificationId());

    // ユーザー登録処理
    final ExposedUser user = signupUserApi.execute(input.email(), input.password());
    return new Output(user, verificationResult);
  }

  public record Input(String email, String password) {}

  public record Output(ExposedUser user, VerificationResult verificationResult) {}
}
