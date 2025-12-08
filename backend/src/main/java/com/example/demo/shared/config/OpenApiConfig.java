package com.example.demo.shared.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** OpenAPI設定. Actor別にAPI定義を分割する. */
@Configuration
public class OpenApiConfig {

  @Bean
  public GroupedOpenApi adminApi() {
    return GroupedOpenApi.builder().group("admin-api").pathsToMatch("/v1/admin/**").build();
  }

  @Bean
  public GroupedOpenApi customerApi() {
    return GroupedOpenApi.builder().group("customer-api").pathsToMatch("/v1/customer/**").build();
  }
}
