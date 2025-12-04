package com.example.demo.shared.kafka.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/** DLQ（Dead Letter Queue）のコンシューマ. */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class DlqConsumer {

  private static final Logger log = LoggerFactory.getLogger(DlqConsumer.class);

  @KafkaListener(topics = "demo.dlq", groupId = "${spring.application.name}-dlq")
  public void consume(final ConsumerRecord<String, Object> record) {
    log.error(
        "DLQ received: topic={}, partition={}, offset={}, key={}, value={}",
        record.topic(),
        record.partition(),
        record.offset(),
        record.key(),
        record.value());
  }
}
