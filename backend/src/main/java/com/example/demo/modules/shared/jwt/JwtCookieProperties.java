package com.example.demo.modules.shared.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** JWT Cookie設定プロパティ. application.ymlの jwt.cookie セクションから設定を読み込む */
@Component
@ConfigurationProperties(prefix = "jwt.cookie")
public class JwtCookieProperties {

  private String name = "accessToken";
  private boolean httpOnly = true;
  private boolean secure = false;
  private String sameSite = "Lax";
  private long maxAgeSeconds = 2592000L; // 30 days

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  public boolean isHttpOnly() {
    return httpOnly;
  }

  public void setHttpOnly(final boolean httpOnly) {
    this.httpOnly = httpOnly;
  }

  public boolean isSecure() {
    return secure;
  }

  public void setSecure(final boolean secure) {
    this.secure = secure;
  }

  public String getSameSite() {
    return sameSite;
  }

  public void setSameSite(final String sameSite) {
    this.sameSite = sameSite;
  }

  public long getMaxAgeSeconds() {
    return maxAgeSeconds;
  }

  public void setMaxAgeSeconds(final long maxAgeSeconds) {
    this.maxAgeSeconds = maxAgeSeconds;
  }
}
