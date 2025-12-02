package com.example.demo.shared.api;

/**
 * API バージョン管理.
 *
 * <p>全APIのバージョンプレフィックスを一元管理する。
 *
 * <p>RestApiクラスでの使用例：
 *
 * <pre>{@code
 * @RequestMapping(value = V1 + "/auth", ...)
 * }</pre>
 *
 * <p>テストではApiTestClientが自動的にV1プレフィックスを付与するため、 パスのみを指定する：
 *
 * <pre>{@code
 * apiTestClient.post("/auth/signup", request);
 * }</pre>
 */
public final class ApiVersion {

  /** API v1 プレフィックス. */
  public static final String V1 = "/v1";

  private ApiVersion() {}
}
