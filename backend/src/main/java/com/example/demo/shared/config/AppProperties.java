package com.example.demo.shared.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
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

  @Valid @NotNull private Kafka kafka = new Kafka();

  @Valid @NotNull private EmailConfig email = new EmailConfig();

  @Valid @NotNull private Mockoon mockoon = new Mockoon();

  @Valid @NotNull private ExternalApi externalApi = new ExternalApi();

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

  public Kafka getKafka() {
    return kafka;
  }

  public void setKafka(final Kafka kafka) {
    this.kafka = kafka;
  }

  public EmailConfig getEmail() {
    return email;
  }

  public void setEmail(final EmailConfig email) {
    this.email = email;
  }

  public Mockoon getMockoon() {
    return mockoon;
  }

  public void setMockoon(final Mockoon mockoon) {
    this.mockoon = mockoon;
  }

  public ExternalApi getExternalApi() {
    return externalApi;
  }

  public void setExternalApi(final ExternalApi externalApi) {
    this.externalApi = externalApi;
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
    private String secret = "";

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

  /** Kafka設定. */
  public static class Kafka {

    @NotNull private Boolean enabled = false;

    public Boolean getEnabled() {
      return enabled;
    }

    public void setEnabled(final Boolean enabled) {
      this.enabled = enabled;
    }

    public boolean isEnabled() {
      return Boolean.TRUE.equals(enabled);
    }
  }

  /** メール設定. */
  public static class EmailConfig {

    @NotBlank @Email private String from;

    @NotBlank @Email private String replyTo;

    public String getFrom() {
      return from;
    }

    public void setFrom(final String from) {
      this.from = from;
    }

    public String getReplyTo() {
      return replyTo;
    }

    public void setReplyTo(final String replyTo) {
      this.replyTo = replyTo;
    }
  }

  /** Mockoon Mock Server設定. */
  public static class Mockoon {

    @NotNull private Boolean enabled = false;

    @NotBlank private String apiUrl = "";

    public Boolean getEnabled() {
      return enabled;
    }

    public void setEnabled(final Boolean enabled) {
      this.enabled = enabled;
    }

    public boolean isEnabled() {
      return Boolean.TRUE.equals(enabled);
    }

    public String getApiUrl() {
      return apiUrl;
    }

    public void setApiUrl(final String apiUrl) {
      this.apiUrl = apiUrl;
    }
  }

  /** 外部API設定. */
  public static class ExternalApi {

    @NotBlank private String baseUrl = "";

    public String getBaseUrl() {
      return baseUrl;
    }

    public void setBaseUrl(final String baseUrl) {
      this.baseUrl = baseUrl;
    }
  }
}
