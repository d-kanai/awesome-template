package com.example.demo.shared.infrastructure.externalapi;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.infrastructure.externalapi.generated.api.DefaultApi;
import com.example.demo.shared.infrastructure.externalapi.generated.client.ApiClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** 外部API クライアント設定. */
@Configuration
public class ExternalApiClientConfig {

  private final AppProperties appProperties;

  public ExternalApiClientConfig(final AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  @Bean
  public ApiClient externalApiClient() {
    final ApiClient apiClient = new ApiClient();
    final String baseUrl = resolveBaseUrl();
    apiClient.updateBaseUri(baseUrl);
    return apiClient;
  }

  @Bean
  public DefaultApi defaultApi(final ApiClient externalApiClient) {
    return new DefaultApi(externalApiClient);
  }

  private String resolveBaseUrl() {
    if (appProperties.getMockoon().isEnabled()) {
      return appProperties.getMockoon().getApiUrl();
    }
    return appProperties.getExternalApi().getBaseUrl();
  }
}
