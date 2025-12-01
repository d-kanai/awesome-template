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
    System.out.println("=== Detected Modules ===");
    modules.forEach(module -> System.out.println("  - " + module.getName()));
    modules.verify();
  }

  @Test
  void sharedモジュールは他モジュールに依存しないことを検証する() {
    // shared は他の全モジュールに依存してはいけない
    final var sharedModule = modules.getModuleByName("shared");
    assertThat(sharedModule).isPresent();

    final var sharedDependencies = sharedModule.get().getDependencies(modules);

    // shared以外の全モジュールを取得し、sharedがそれらに依存していないことを確認
    modules.stream()
        .filter(module -> !module.getName().equals("shared"))
        .forEach(
            module ->
                assertThat(sharedDependencies.contains(module.getName()))
                    .as("sharedは%sに依存してはいけない", module.getName())
                    .isFalse());
  }

  @Test
  void モジュールドキュメントを生成する() {
    new Documenter(modules).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
  }
}
