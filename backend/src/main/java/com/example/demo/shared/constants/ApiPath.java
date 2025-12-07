package com.example.demo.shared.constants;

public final class ApiPath {
  public static final String API_VERSION = "/v1";

  // Actor別Prefix
  public static final String CUSTOMER = API_VERSION + "/customer";
  public static final String ADMIN = API_VERSION + "/admin";

  // Customer API paths
  public static final String CUSTOMER_AUTH = CUSTOMER + "/auth";
  public static final String CUSTOMER_AUTH_SIGNUP = CUSTOMER_AUTH + "/signup";
  public static final String CUSTOMER_AUTH_SIGNIN = CUSTOMER_AUTH + "/signin";
  public static final String CUSTOMER_AUTH_ME = CUSTOMER_AUTH + "/me";
  public static final String CUSTOMER_USERS = CUSTOMER + "/users";
  public static final String CUSTOMER_USERS_EMAIL = CUSTOMER_USERS + "/email";
  public static final String CUSTOMER_USERS_PASSWORD = CUSTOMER_USERS + "/password";

  // Admin API paths
  public static final String ADMIN_AUTH = ADMIN + "/auth";
  public static final String ADMIN_AUTH_SIGNIN = ADMIN_AUTH + "/signin";
  public static final String ADMIN_AUTH_ME = ADMIN_AUTH + "/me";

  private ApiPath() {}
}
