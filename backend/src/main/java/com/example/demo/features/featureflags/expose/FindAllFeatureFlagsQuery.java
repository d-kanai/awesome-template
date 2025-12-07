package com.example.demo.features.featureflags.expose;

import com.example.demo.features.featureflags.internal.domain.evaluator.FeatureFlagEvaluator;
import com.example.demo.features.featureflags.internal.domain.model.UserContext;
import com.example.demo.shared.config.AppProperties;
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

  private final List<FeatureFlagEvaluator> evaluators;
  private final AppProperties appProperties;

  public FindAllFeatureFlagsQuery(
      final List<FeatureFlagEvaluator> evaluators, final AppProperties appProperties) {
    this.evaluators = evaluators;
    this.appProperties = appProperties;
  }

  /**
   * すべてのフィーチャーフラグを評価する.
   *
   * @return フィーチャーフラグの評価結果
   */
  public Output execute() {
    final var ctx = UserContext.current(appProperties);
    final Map<String, Boolean> flags =
        evaluators.stream()
            .collect(Collectors.toMap(FeatureFlagEvaluator::flagName, e -> e.evaluate(ctx)));
    return new Output(flags);
  }

  /** フィーチャーフラグ評価結果の出力. */
  public record Output(Map<String, Boolean> flags) {}
}
