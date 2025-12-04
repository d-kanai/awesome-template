package com.example.demo.shared.kafka.producer;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.DomainEventName;
import com.example.demo.shared.event.EventPublisher;
import com.example.demo.shared.kafka.KafkaTopics;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Kafka を使用したイベント発行実装.
 *
 * <p>DomainEvent と CommandEvent の両方を Kafka に発行する。 at-least-once 配信のため、Consumer 側で idempotency
 * チェックが必要。
 */
@Component("kafkaEventPublisher")
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaEventPublisher implements EventPublisher {

  private static final String TRANSPORT = "kafka";
  private static final String USER_EVENTS_TOPIC = KafkaTopics.PREFIX + "user.events";
  private static final String DLQ_TOPIC = KafkaTopics.PREFIX + "dlq";

  private final KafkaTemplate<String, Object> kafkaTemplate;
  private final AppLogger appLogger;

  @SuppressWarnings("unchecked")
  public KafkaEventPublisher(
      final KafkaTemplate<String, ?> kafkaTemplate, final AppLogger appLogger) {
    this.kafkaTemplate = (KafkaTemplate<String, Object>) kafkaTemplate;
    this.appLogger = appLogger;
  }

  @Override
  public void publishDomainEvent(final DomainEvent event) {
    final String topic = resolveTopicFromEventName(event.domainEventName());
    final String eventNameValue = event.domainEventName().getValue();
    final String eventIdValue = event.eventId().toString();
    kafkaTemplate
        .send(topic, eventIdValue, event)
        .whenComplete(
            (result, ex) -> {
              if (ex != null) {
                appLogger.logEventPublishError(
                    KafkaEventPublisher.class,
                    TRANSPORT,
                    eventNameValue,
                    eventIdValue,
                    new RuntimeException(ex));
              } else {
                appLogger.logEventPublish(
                    KafkaEventPublisher.class,
                    TRANSPORT,
                    eventNameValue,
                    eventIdValue,
                    Map.of(
                        "topic", topic,
                        "partition", result.getRecordMetadata().partition(),
                        "offset", result.getRecordMetadata().offset()));
              }
            });
  }

  @Override
  public void publishCommandEvent(final CommandEvent event) {
    final String key = event.eventId().toString();
    final String eventName = event.commandEventName().getValue();
    final String topic = KafkaTopics.PREFIX + eventName;
    kafkaTemplate
        .send(topic, key, event)
        .whenComplete(
            (result, ex) -> {
              if (ex != null) {
                appLogger.logCommandEventPublishError(
                    KafkaEventPublisher.class, TRANSPORT, eventName, new RuntimeException(ex));
              } else {
                appLogger.logCommandEventPublish(
                    KafkaEventPublisher.class,
                    TRANSPORT,
                    eventName,
                    Map.of(
                        "eventId", event.eventId(),
                        "topic", topic,
                        "partition", result.getRecordMetadata().partition(),
                        "offset", result.getRecordMetadata().offset()));
              }
            });
  }

  private String resolveTopicFromEventName(final DomainEventName eventName) {
    final String value = eventName.getValue();
    final String prefix = value.substring(0, value.indexOf('.'));
    if ("user".equals(prefix)) {
      return USER_EVENTS_TOPIC;
    }
    return DLQ_TOPIC;
  }
}
