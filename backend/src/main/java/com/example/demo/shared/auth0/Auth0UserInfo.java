package com.example.demo.shared.auth0;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Auth0 /userinfo エンドポイントからのレスポンス.
 *
 * @param sub Auth0 User ID (例: "auth0|123456")
 * @param email メールアドレス
 */
public record Auth0UserInfo(@JsonProperty("sub") String sub, @JsonProperty("email") String email) {}
