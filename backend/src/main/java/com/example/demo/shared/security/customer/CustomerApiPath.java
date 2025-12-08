package com.example.demo.shared.security.customer;

import com.example.demo.shared.api.ApiVersion;

/** Customer API のベースパス定義. */
public final class CustomerApiPath {

  public static final String BASE = ApiVersion.V1 + "/customer";

  private CustomerApiPath() {}
}
