package com.example.demo.config;

import com.atlassian.oai.validator.OpenApiInteractionValidator;
import com.atlassian.oai.validator.springmvc.OpenApiValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

@Configuration
public class OpenApiValidationConfig {

    private static final String OPENAPI_SPEC_LOCATION = "classpath:/openapi/health-api.yaml";

    @Bean
    public FilterRegistrationBean<OpenApiValidationFilter> openApiValidationFilter() {
        OpenApiInteractionValidator validator = OpenApiInteractionValidator.createFor(OPENAPI_SPEC_LOCATION)
            .withFailOnUnknownProperties(true)
            .build();

        FilterRegistrationBean<OpenApiValidationFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new OpenApiValidationFilter(true, true, validator));
        registration.addUrlPatterns("/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
