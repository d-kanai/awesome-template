package com.example.demo.features.featureflag.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import io.getunleash.Unleash;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FeatureFlagServiceTest {

  @Mock private Unleash unleash;

  private FeatureFlagService featureFlagService;

  @BeforeEach
  void setUp() {
    featureFlagService = new FeatureFlagService(unleash);
  }

  @Test
  void フィーチャーフラグが有効な場合_trueを返す() {
    // given
    final String featureName = "sample-feature";
    when(unleash.isEnabled(featureName)).thenReturn(true);

    // when
    final boolean result = featureFlagService.isEnabled(featureName);

    // then
    assertThat(result).isTrue();
  }

  @Test
  void フィーチャーフラグが無効な場合_falseを返す() {
    // given
    final String featureName = "disabled-feature";
    when(unleash.isEnabled(featureName)).thenReturn(false);

    // when
    final boolean result = featureFlagService.isEnabled(featureName);

    // then
    assertThat(result).isFalse();
  }

  @Test
  void ユーザーIDを指定してフィーチャーフラグが有効な場合_trueを返す() {
    // given
    final String featureName = "user-specific-feature";
    final String userId = "user123";
    when(unleash.isEnabled(eq(featureName), any(io.getunleash.UnleashContext.class)))
        .thenReturn(true);

    // when
    final boolean result = featureFlagService.isEnabled(featureName, userId);

    // then
    assertThat(result).isTrue();
  }

  @Test
  void デフォルト値を指定した場合_フラグが見つからない場合はデフォルト値を返す() {
    // given
    final String featureName = "nonexistent-feature";
    final String userId = "user123";
    final boolean defaultValue = true;
    when(unleash.isEnabled(eq(featureName), any(io.getunleash.UnleashContext.class), anyBoolean()))
        .thenReturn(defaultValue);

    // when
    final boolean result = featureFlagService.isEnabled(featureName, userId, defaultValue);

    // then
    assertThat(result).isEqualTo(defaultValue);
  }
}
