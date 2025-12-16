package com.example.demo.shared.auth0;

import com.example.demo.shared.config.AppProperties;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Auth0 APIクライアント.
 *
 * <p>Opaque Access Tokenを検証し、ユーザー情報を取得する。
 */
@Component
public class Auth0Client implements Auth0ClientInterface {

  private static final Logger log = LoggerFactory.getLogger(Auth0Client.class);

  private final RestClient restClient;
  private final AppProperties appProperties;

  public Auth0Client(
      final RestClient.Builder restClientBuilder, final AppProperties appProperties) {
    this.restClient = restClientBuilder.build();
    this.appProperties = appProperties;
  }

  /**
   * Auth0 /userinfo エンドポイントを呼び出してユーザー情報を取得.
   *
   * @param accessToken Auth0 Opaque Access Token
   * @return ユーザー情報、トークンが無効な場合はnull
   */
  @Override
  public @Nullable Auth0UserInfo getUserInfo(final String accessToken) {
    final String userInfoUrl = appProperties.getAuth0().getUserInfoUrl();

    try {
      return restClient
          .get()
          .uri(userInfoUrl)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
          .retrieve()
          .body(Auth0UserInfo.class);
    } catch (final RestClientException e) {
      log.warn("Auth0 /userinfo request failed: {}", e.getMessage());
      return null;
    }
  }
}
