package com.example.demo.features.customer.auth.internal.infrastructure.externalapi;

import com.example.demo.shared.infrastructure.externalapi.generated.api.DefaultApi;
import com.example.demo.shared.infrastructure.externalapi.generated.client.ApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** 外部API クライアント設定. */
@Configuration
public class ExternalApiClientConfig {

  @Value("${app.external-api.base-url}")
  private String baseUrl;

  @Bean
  public ApiClient externalApiClient() {
    final ApiClient apiClient = new ApiClient();
    apiClient.updateBaseUri(baseUrl);
    return apiClient;
  }

  @Bean
  public DefaultApi defaultApi(final ApiClient externalApiClient) {
    return new DefaultApi(externalApiClient);
  }
}
