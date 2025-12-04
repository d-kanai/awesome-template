package com.example.demo.testsupport;

import com.example.demo.shared.event.EventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * テスト用EventPublisher設定.
 *
 * <p>SignupCommand等が @Qualifier で "kafkaEventPublisher" と "springEventPublisher" を要求するため、
 * 両方のBeanを同じTestEventPublisherインスタンスで提供する。
 *
 * <p>テストプロファイルで app.test-event-publisher.enabled=true が設定されると、 本番の
 * NoOpEventPublisher/SpringEventPublisher が無効化され、この設定が有効になる。
 */
@Configuration
public class TestEventPublisherConfig {

  @Bean("kafkaEventPublisher")
  public EventPublisher kafkaEventPublisher(final TestEventPublisher testEventPublisher) {
    return testEventPublisher;
  }

  @Bean("springEventPublisher")
  public EventPublisher springEventPublisher(final TestEventPublisher testEventPublisher) {
    return testEventPublisher;
  }
}
