package com.example.demo.features.featureflag.internal.domain.evaluator;

import com.example.demo.features.featureflag.expose.UserContext;

/**
 * フィーチャーフラグ評価インターフェース.
 *
 * <p>各フィーチャーフラグはこのインターフェースを実装し、ユーザーコンテキストに基づいて有効/無効を判定する。
 */
public interface FeatureFlag {

  /**
   * フィーチャーフラグを評価する.
   *
   * @param ctx ユーザーコンテキスト
   * @return フラグが有効な場合true
   */
  boolean evaluate(UserContext ctx);

  /**
   * フィーチャーフラグ名を返す.
   *
   * @return フラグ名
   */
  String flagName();
}
