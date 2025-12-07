package com.example.demo.features.featureflag.expose;

import com.example.demo.features.featureflag.internal.domain.evaluator.FeatureFlag;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * すべてのフィーチャーフラグを評価するクエリ.
 *
 * <p>現在の認証ユーザーと環境に基づいて、すべてのフラグの有効/無効を判定する。
 */
@Service
@Transactional(readOnly = true)
public class FindAllFeatureFlagsQuery {

  private final List<FeatureFlag> evaluators;

  public FindAllFeatureFlagsQuery(final List<FeatureFlag> evaluators) {
    this.evaluators = evaluators;
  }

  /**
   * すべてのフィーチャーフラグを評価する.
   *
   * @param ctx ユーザーコンテキスト
   * @return フィーチャーフラグの評価結果
   */
  public Output execute(final UserContext ctx) {
    final Map<String, Boolean> flags =
        evaluators.stream().collect(Collectors.toMap(FeatureFlag::flagName, e -> e.evaluate(ctx)));
    return new Output(flags);
  }

  /** フィーチャーフラグ評価結果の出力. */
  public record Output(Map<String, Boolean> flags) {}
}
