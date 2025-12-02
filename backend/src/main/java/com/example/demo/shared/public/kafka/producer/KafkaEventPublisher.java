package com.example.demo.shared.kafka.producer;

import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/** Kafkaを使用したイベント発行実装. */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaEventPublisher implements EventPublisher {

  private static final Logger log = LoggerFactory.getLogger(KafkaEventPublisher.class);
  private static final String USER_EVENTS_TOPIC = "demo.user.events";
  private static final String DLQ_TOPIC = "demo.dlq";

  private final KafkaTemplate<String, DomainEvent> kafkaTemplate;

  public KafkaEventPublisher(final KafkaTemplate<String, DomainEvent> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Override
  public void publish(final DomainEvent event) {
    final String topic = resolveTopicFromEventType(event.eventType());
    kafkaTemplate
        .send(topic, event.eventId().toString(), event)
        .whenComplete(
            (result, ex) -> {
              if (ex != null) {
                log.error(
                    "Event publish failed: eventId={}, eventType={}, topic={}, error={}",
                    event.eventId(),
                    event.eventType(),
                    topic,
                    ex.getMessage(),
                    ex);
              } else {
                log.info(
                    "Event published: eventId={}, eventType={}, topic={}, partition={}, offset={}",
                    event.eventId(),
                    event.eventType(),
                    topic,
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
              }
            });
  }

  private String resolveTopicFromEventType(final String eventType) {
    // "user.signed_up" -> "user" -> user-events topic
    final String prefix = eventType.split("\\.")[0];
    if ("user".equals(prefix)) {
      return USER_EVENTS_TOPIC;
    }
    return DLQ_TOPIC;
  }
}
