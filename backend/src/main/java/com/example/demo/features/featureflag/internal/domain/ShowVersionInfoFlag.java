package com.example.demo.features.featureflag.internal.domain;

import com.example.demo.features.featureflag.expose.UserContext;
import com.example.demo.shared.config.AppProperties;
import org.springframework.stereotype.Component;

/**
 * バージョン情報表示フィーチャーフラグ.
 *
 * <p>開発環境・ステージング環境では常に有効。本番環境では特定ユーザーのみ有効。
 */
@Component
public class ShowVersionInfoFlag implements FeatureFlag {

  @Override
  public boolean evaluate(final UserContext ctx) {
    if (ctx.environment() == AppProperties.Env.DEVELOPMENT) {
      return true;
    }
    if (ctx.environment() == AppProperties.Env.STAGING) {
      return true;
    }
    if ("1".equals(ctx.userId())) {
      return true;
    }
    return false;
  }

  @Override
  public String flagName() {
    return "showVersionInfo";
  }
}
