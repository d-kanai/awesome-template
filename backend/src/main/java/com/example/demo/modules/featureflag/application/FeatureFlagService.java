package com.example.demo.modules.featureflag.application;

import io.getunleash.Unleash;
import io.getunleash.UnleashContext;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service for feature flag evaluation using Unleash. */
@Service
public class FeatureFlagService {

  private final Optional<Unleash> unleash;

  public FeatureFlagService(@Autowired(required = false) final Unleash unleash) {
    this.unleash = Optional.ofNullable(unleash);
  }

  /**
   * Check if a feature flag is enabled.
   *
   * @param featureName The name of the feature flag.
   * @return true if the feature is enabled, false otherwise.
   */
  public boolean isEnabled(final String featureName) {
    return unleash.map(u -> u.isEnabled(featureName)).orElse(false);
  }

  /**
   * Check if a feature flag is enabled with user context.
   *
   * @param featureName The name of the feature flag.
   * @param userId The user ID for context.
   * @return true if the feature is enabled for the user, false otherwise.
   */
  public boolean isEnabled(final String featureName, final String userId) {
    return unleash
        .map(
            u -> {
              final UnleashContext context = UnleashContext.builder().userId(userId).build();
              return u.isEnabled(featureName, context);
            })
        .orElse(false);
  }

  /**
   * Check if a feature flag is enabled with user context and default value.
   *
   * @param featureName The name of the feature flag.
   * @param userId The user ID for context.
   * @param defaultValue The default value if the feature flag is not found.
   * @return true if the feature is enabled for the user, defaultValue otherwise.
   */
  public boolean isEnabled(
      final String featureName, final String userId, final boolean defaultValue) {
    return unleash
        .map(
            u -> {
              final UnleashContext context = UnleashContext.builder().userId(userId).build();
              return u.isEnabled(featureName, context, defaultValue);
            })
        .orElse(defaultValue);
  }
}
