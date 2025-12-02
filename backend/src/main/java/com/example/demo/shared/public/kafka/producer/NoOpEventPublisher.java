package com.example.demo.shared.kafka.producer;

import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/** Kafka無効時のイベント発行実装（ログ出力のみ）. */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpEventPublisher implements EventPublisher {

  private static final Logger log = LoggerFactory.getLogger(NoOpEventPublisher.class);

  @Override
  public void publish(final DomainEvent event) {
    log.debug(
        "Event publish skipped (Kafka disabled): eventId={}, eventType={}",
        event.eventId(),
        event.eventType());
  }
}
