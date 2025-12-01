package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

class ModularityTest {

  private final ApplicationModules modules = ApplicationModules.of(DemoApplication.class);

  @Test
  void モジュール構成が正しいことを検証する() {
    // Spring Modulithによる検証（内部でArchUnitを使用）
    // - internal パッケージへの外部アクセス禁止
    // - 循環依存の検出
    // - モジュール境界の検証
    modules.verify();
  }

  @Test
  void sharedモジュールは他モジュールに依存しないことを検証する() {
    // shared → auth, user, test への依存は禁止
    final var sharedModule = modules.getModuleByName("shared");
    assertThat(sharedModule).isPresent();
    final var dependencies = sharedModule.get().getDependencies(modules);
    assertThat(dependencies.contains("auth")).isFalse();
    assertThat(dependencies.contains("user")).isFalse();
    assertThat(dependencies.contains("test")).isFalse();
  }

  @Test
  void モジュールドキュメントを生成する() {
    new Documenter(modules).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
  }
}
