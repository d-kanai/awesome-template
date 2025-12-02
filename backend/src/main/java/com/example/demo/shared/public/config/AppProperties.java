package com.example.demo.shared.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * アプリケーション全体の設定プロパティ.
 *
 * <p>起動時にバリデーションが実行され、必須項目が未設定の場合はアプリケーションが起動しない。
 */
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {

  @NotNull private Env env = Env.DEVELOPMENT;

  @Valid @NotNull private Jwt jwt = new Jwt();

  @Valid @NotNull private Cors cors = new Cors();

  public Env getEnv() {
    return env;
  }

  public void setEnv(final Env env) {
    this.env = env;
  }

  public Jwt getJwt() {
    return jwt;
  }

  public void setJwt(final Jwt jwt) {
    this.jwt = jwt;
  }

  public Cors getCors() {
    return cors;
  }

  public void setCors(final Cors cors) {
    this.cors = cors;
  }

  public boolean isDev() {
    return env == Env.DEVELOPMENT;
  }

  public boolean isStaging() {
    return env == Env.STAGING;
  }

  public boolean isProd() {
    return env == Env.PRODUCTION;
  }

  public boolean isTest() {
    return env == Env.TEST;
  }

  /** ログをJSON形式で出力すべきか（STAGING/PRODUCTION）. */
  public boolean shouldUseJsonLog() {
    return env == Env.STAGING || env == Env.PRODUCTION;
  }

  /** 環境種別. */
  public enum Env {
    DEVELOPMENT,
    STAGING,
    PRODUCTION,
    TEST
  }

  /** JWT設定. */
  public static class Jwt {

    @NotBlank(message = "JWT secret is required")
    private String secret;

    @Positive private int expirationHours = 720;

    @Valid @NotNull private Cookie cookie = new Cookie();

    public String getSecret() {
      return secret;
    }

    public void setSecret(final String secret) {
      this.secret = secret;
    }

    public int getExpirationHours() {
      return expirationHours;
    }

    public void setExpirationHours(final int expirationHours) {
      this.expirationHours = expirationHours;
    }

    public Cookie getCookie() {
      return cookie;
    }

    public void setCookie(final Cookie cookie) {
      this.cookie = cookie;
    }

    /** JWT Cookie設定. */
    public static class Cookie {

      @NotBlank private String name = "accessToken";

      private boolean httpOnly = true;

      private boolean secure = false;

      @NotBlank private String sameSite = "Lax";

      @Positive private long maxAgeSeconds = 2592000L;

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
  }

  /** CORS設定. */
  public static class Cors {

    @NotNull private List<String> allowedOrigins = List.of("http://localhost:3000");

    public List<String> getAllowedOrigins() {
      return allowedOrigins;
    }

    public void setAllowedOrigins(final List<String> allowedOrigins) {
      this.allowedOrigins = allowedOrigins;
    }
  }
}
