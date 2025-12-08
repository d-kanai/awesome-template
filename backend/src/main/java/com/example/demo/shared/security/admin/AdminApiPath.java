package com.example.demo.shared.security.admin;

import com.example.demo.shared.api.ApiVersion;

/** Admin API のベースパス定義. */
public final class AdminApiPath {

  public static final String BASE = ApiVersion.V1 + "/admin";

  private AdminApiPath() {}
}
