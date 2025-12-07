package com.example.demo.shared.infrastructure.externalapi;

import com.example.demo.shared.infrastructure.externalapi.generated.api.DefaultApi;
import com.example.demo.shared.infrastructure.externalapi.generated.client.ApiException;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserRequest;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** ユーザー検証サービス (外部API連携). */
@Service
public class UserVerificationService {

  private static final Logger logger = LoggerFactory.getLogger(UserVerificationService.class);

  private final DefaultApi externalApi;

  public UserVerificationService(final DefaultApi externalApi) {
    this.externalApi = externalApi;
  }

  /**
   * ユーザー情報を外部APIで検証する.
   *
   * @param email ユーザーのメールアドレス
   * @param name ユーザーの名前
   * @return 検証結果
   */
  public VerificationResult verify(final String email, final String name) {
    logger.info("Verifying user via external API: email={}, name={}", email, name);

    final VerifyUserRequest request = new VerifyUserRequest();
    request.email(email);
    request.name(name);

    try {
      final VerifyUserResponse response = externalApi.verifyUser(request);

      if (response == null) {
        logger.warn("External API returned null response: email={}", email);
        return new VerificationResult(false, null, "No response from external API");
      }

      logger.info(
          "User verification completed: email={}, verified={}, verificationId={}",
          email,
          response.getVerified(),
          response.getVerificationId());

      return new VerificationResult(
          response.getVerified(),
          response.getVerificationId() != null ? response.getVerificationId().toString() : null,
          response.getMessage());
    } catch (final ApiException e) {
      logger.error(
          "Failed to verify user via external API: email={}, status={}, message={}",
          email,
          e.getCode(),
          e.getMessage());
      return new VerificationResult(false, null, "External API call failed: " + e.getMessage());
    } catch (final Exception e) {
      logger.error("Failed to verify user via external API: email=" + email, e);
      return new VerificationResult(false, null, "External API call failed: " + e.getMessage());
    }
  }

  public record VerificationResult(Boolean verified, String verificationId, String message) {}
}
