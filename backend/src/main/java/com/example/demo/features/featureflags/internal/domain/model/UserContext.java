package com.example.demo.features.featureflags.internal.domain.model;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.security.AuthContext;

/**
 * フィーチャーフラグ評価用のユーザーコンテキスト.
 *
 * <p>認証済みユーザーの情報と環境情報を保持する。
 */
public record UserContext(String userId, String email, AppProperties.Env environment) {

  /**
   * 現在の認証ユーザーのコンテキストを生成する.
   *
   * @param appProperties アプリケーション設定
   * @return ユーザーコンテキスト
   */
  public static UserContext current(final AppProperties appProperties) {
    return new UserContext(
        AuthContext.getCurrentUserId(), AuthContext.getCurrentEmail(), appProperties.getEnv());
  }
}
