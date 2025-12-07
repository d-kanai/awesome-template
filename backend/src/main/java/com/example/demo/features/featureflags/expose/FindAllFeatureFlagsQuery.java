package com.example.demo.features.featureflags.expose;

import com.example.demo.features.featureflags.internal.domain.evaluator.FeatureFlag;
import com.example.demo.features.featureflags.internal.domain.model.UserContext;
import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.security.admin.AdminAuthContext;
import com.example.demo.shared.security.customer.CustomerAuthContext;
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
  private final AppProperties appProperties;

  public FindAllFeatureFlagsQuery(
      final List<FeatureFlag> evaluators, final AppProperties appProperties) {
    this.evaluators = evaluators;
    this.appProperties = appProperties;
  }

  /**
   * すべてのフィーチャーフラグを評価する（Customer向け）.
   *
   * @return フィーチャーフラグの評価結果
   */
  public Output execute() {
    final var ctx =
        new UserContext(
            CustomerAuthContext.getCurrentUserId(),
            CustomerAuthContext.getCurrentEmail(),
            appProperties.getEnv());
    return evaluateFlags(ctx);
  }

  /**
   * すべてのフィーチャーフラグを評価する（Admin向け）.
   *
   * @return フィーチャーフラグの評価結果
   */
  public Output executeForAdmin() {
    final var ctx =
        new UserContext(
            AdminAuthContext.getCurrentAdminId(),
            AdminAuthContext.getCurrentEmail(),
            appProperties.getEnv());
    return evaluateFlags(ctx);
  }

  private Output evaluateFlags(final UserContext ctx) {
    final Map<String, Boolean> flags =
        evaluators.stream()
            .collect(Collectors.toMap(FeatureFlag::flagName, e -> e.evaluate(ctx)));
    return new Output(flags);
  }

  /** フィーチャーフラグ評価結果の出力. */
  public record Output(Map<String, Boolean> flags) {}
}
