package com.example.demo.shared.infrastructure.externalapi;

import com.example.demo.shared.infrastructure.externalapi.generated.api.DefaultApi;
import com.example.demo.shared.infrastructure.externalapi.generated.client.ApiException;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserRequest;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserResponse;
import com.example.demo.shared.logging.AppLogger;
import org.springframework.stereotype.Service;

/** ユーザー検証外部API (外部API連携). */
@Service
public class UserVerificationExternalApi {

  private static final String API_NAME = "verifyUser";

  private final AppLogger appLogger;
  private final DefaultApi externalApi;

  public UserVerificationExternalApi(final AppLogger appLogger, final DefaultApi externalApi) {
    this.appLogger = appLogger;
    this.externalApi = externalApi;
  }

  /**
   * ユーザー情報を外部APIで検証する.
   *
   * @param email ユーザーのメールアドレス
   * @param name ユーザーの名前
   * @return 検証結果
   */
  public VerificationResult execute(final String email, final String name) {
    appLogger.logExternalApiRequest(UserVerificationExternalApi.class, API_NAME, email, name);

    final VerifyUserRequest request = new VerifyUserRequest();
    request.email(email);
    request.name(name);

    try {
      final VerifyUserResponse response = externalApi.verifyUser(request);

      if (response == null) {
        appLogger.logExternalApiNullResponse(UserVerificationExternalApi.class, API_NAME, email);
        return new VerificationResult(false, null, "No response from external API");
      }

      final String verificationId =
          response.getVerificationId() != null ? response.getVerificationId().toString() : null;

      appLogger.logExternalApiResponse(
          UserVerificationExternalApi.class,
          API_NAME,
          email,
          response.getVerified(),
          verificationId);

      return new VerificationResult(
          response.getVerified(), verificationId, response.getMessage());
    } catch (final ApiException e) {
      appLogger.logExternalApiError(
          UserVerificationExternalApi.class, API_NAME, email, e.getCode(), e.getMessage());
      return new VerificationResult(false, null, "External API call failed: " + e.getMessage());
    } catch (final Exception e) {
      appLogger.logExternalApiException(UserVerificationExternalApi.class, API_NAME, email, e);
      return new VerificationResult(false, null, "External API call failed: " + e.getMessage());
    }
  }

  public record VerificationResult(Boolean verified, String verificationId, String message) {}
}
