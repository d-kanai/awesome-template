package com.example.demo.features.featureflag.config;

import io.getunleash.DefaultUnleash;
import io.getunleash.Unleash;
import io.getunleash.util.UnleashConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Configuration for Unleash feature flag client. */
@Configuration
@ConditionalOnProperty(name = "unleash.enabled", havingValue = "true", matchIfMissing = true)
public class FeatureFlagConfig {

  /**
   * Creates and configures the Unleash client bean.
   *
   * @param properties Unleash configuration properties
   * @return Configured Unleash instance.
   */
  @Bean
  public Unleash unleash(final UnleashProperties properties) {
    final UnleashConfig config =
        UnleashConfig.builder()
            .appName(properties.getAppName())
            .instanceId(properties.getAppName())
            .unleashAPI(properties.getApiUrl())
            .apiKey(properties.getApiToken())
            .environment(properties.getEnvironment())
            .synchronousFetchOnInitialisation(false)
            .build();

    return new DefaultUnleash(config);
  }

  @Bean
  @ConfigurationProperties(prefix = "unleash")
  public UnleashProperties unleashProperties() {
    return new UnleashProperties();
  }

  /** Configuration properties for Unleash. */
  public static class UnleashProperties {
    private String apiUrl;
    private String apiToken;
    private String appName;
    private String environment = "development";

    public String getApiUrl() {
      return apiUrl;
    }

    public void setApiUrl(final String apiUrl) {
      this.apiUrl = apiUrl;
    }

    public String getApiToken() {
      return apiToken;
    }

    public void setApiToken(final String apiToken) {
      this.apiToken = apiToken;
    }

    public String getAppName() {
      return appName;
    }

    public void setAppName(final String appName) {
      this.appName = appName;
    }

    public String getEnvironment() {
      return environment;
    }

    public void setEnvironment(final String environment) {
      this.environment = environment;
    }
  }
}
