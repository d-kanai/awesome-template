package com.example.demo.shared.auth0;

import org.jspecify.annotations.Nullable;

/**
 * Auth0クライアントのインターフェース.
 *
 * <p>本番環境ではAuth0 APIを呼び出し、テスト環境ではモック実装を使用する。
 */
public interface Auth0ClientInterface {

  /**
   * Auth0 /userinfo エンドポイントを呼び出してユーザー情報を取得.
   *
   * @param accessToken Auth0 Opaque Access Token
   * @return ユーザー情報、トークンが無効な場合はnull
   */
  @Nullable Auth0UserInfo getUserInfo(String accessToken);
}
