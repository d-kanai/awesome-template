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
  void adminモジュールとcustomerモジュールは相互依存しないことを検証する() {
    // admin と customer は Actor が異なるため、相互依存禁止
    modules.stream()
        .filter(module -> module.getName().startsWith("features.admin"))
        .forEach(
            adminModule -> {
              final var dependencies = adminModule.getDependencies(modules);
              modules.stream()
                  .filter(module -> module.getName().startsWith("features.customer"))
                  .forEach(
                      customerModule ->
                          assertThat(dependencies.contains(customerModule.getName()))
                              .as(
                                  "%sは%sに依存してはいけない",
                                  adminModule.getName(), customerModule.getName())
                              .isFalse());
            });

    modules.stream()
        .filter(module -> module.getName().startsWith("features.customer"))
        .forEach(
            customerModule -> {
              final var dependencies = customerModule.getDependencies(modules);
              modules.stream()
                  .filter(module -> module.getName().startsWith("features.admin"))
                  .forEach(
                      adminModule ->
                          assertThat(dependencies.contains(adminModule.getName()))
                              .as(
                                  "%sは%sに依存してはいけない",
                                  customerModule.getName(), adminModule.getName())
                              .isFalse());
            });
  }

  @Test
  void モジュールドキュメントを生成する() {
    new Documenter(modules).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
  }
}
