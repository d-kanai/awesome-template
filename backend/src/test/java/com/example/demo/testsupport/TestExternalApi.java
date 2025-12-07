package com.example.demo.testsupport;

import com.example.demo.shared.infrastructure.externalapi.generated.api.DefaultApi;
import com.example.demo.shared.infrastructure.externalapi.generated.client.ApiException;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserRequest;
import com.example.demo.shared.infrastructure.externalapi.generated.model.VerifyUserResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * テスト用の外部APIモック.
 *
 * <p>TestEventPublisherと同様に、テスト時に外部API呼び出しを記録・検証するためのモック。
 */
@Component
@Profile("test")
public class TestExternalApi {

  private final List<VerifyUserRequest> verifyUserRequests = new ArrayList<>();
  private VerifyUserResponse mockResponse;
  private ApiException mockException;

  public TestExternalApi() {
    // デフォルトのモックレスポンス
    setDefaultMockResponse();
  }

  /** デフォルトのモックレスポンスを設定. */
  public void setDefaultMockResponse() {
    final VerifyUserResponse response = new VerifyUserResponse();
    response.setVerified(true);
    response.setVerificationId(UUID.randomUUID());
    response.setMessage("User verified successfully (mocked)");
    this.mockResponse = response;
    this.mockException = null;
  }

  /** カスタムモックレスポンスを設定. */
  public void setMockResponse(
      final Boolean verified, final UUID verificationId, final String message) {
    final VerifyUserResponse response = new VerifyUserResponse();
    response.setVerified(verified);
    response.setVerificationId(verificationId);
    response.setMessage(message);
    this.mockResponse = response;
    this.mockException = null;
  }

  /** モック例外を設定 (エラーケーステスト用). */
  public void setMockException(final int statusCode, final String message) {
    this.mockException = new ApiException(statusCode, message);
    this.mockResponse = null;
  }

  /** 記録されたverifyUserリクエストを取得. */
  public List<VerifyUserRequest> getVerifyUserRequests() {
    return new ArrayList<>(verifyUserRequests);
  }

  /** 記録をクリア. */
  public void clear() {
    verifyUserRequests.clear();
    setDefaultMockResponse();
  }

  /** テスト用のDefaultApi Beanを提供. */
  @TestConfiguration
  @Profile("test")
  public static class TestDefaultApiConfig {

    @Bean
    @Primary
    public DefaultApi testDefaultApi(final TestExternalApi testExternalApi) {
      return new DefaultApi() {
        @Override
        public VerifyUserResponse verifyUser(final VerifyUserRequest verifyUserRequest)
            throws ApiException {
          // リクエストを記録
          testExternalApi.verifyUserRequests.add(verifyUserRequest);

          // モックの例外が設定されていればスロー
          if (testExternalApi.mockException != null) {
            throw testExternalApi.mockException;
          }

          // モックレスポンスを返す
          return testExternalApi.mockResponse;
        }
      };
    }
  }
}
