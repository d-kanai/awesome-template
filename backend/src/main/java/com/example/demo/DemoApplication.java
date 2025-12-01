package com.example.demo;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@OpenAPIDefinition(
    info =
        @Info(
            title = "Awesome Template API",
            version = "1.0.0",
            description = "Awesome Template バックエンドサービスの API ドキュメントです。"))
@SpringBootApplication
@ConfigurationPropertiesScan
public class DemoApplication {

  public static void main(final String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
