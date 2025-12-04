package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.internal.application.command.SendWelcomeEmailCommand;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka による UserSignedUpEvent を受信するコンシューマ.
 *
 * <p>Domain Event パターン: 「ユーザーが登録した」という事実を受け取り、 notification module 側でメール内容を決定して送信する。
 *
 * <p>Kafka は at-least-once（最低1回）配信のため、SendWelcomeEmailCommand 内で idempotency チェック（AdvisoryLock +
 * NotificationHistory）を行う。
 *
 * <p>比較: SendEmailConsumer は Command パターン（Spring Event）で、 呼び出し側がメール内容を決定し、idempotency チェック不要。
 */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class UserSignedUpConsumer {

  private static final Logger log = LoggerFactory.getLogger(UserSignedUpConsumer.class);

  private final SendWelcomeEmailCommand sendWelcomeEmailCommand;

  public UserSignedUpConsumer(final SendWelcomeEmailCommand sendWelcomeEmailCommand) {
    this.sendWelcomeEmailCommand = sendWelcomeEmailCommand;
  }

  @KafkaListener(
      topics = "demo.user.events",
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  public void consume(final UserSignedUpEvent event) {
    log.info(
        "Received UserSignedUpEvent: domainEventId={}, userId={}, email={}",
        event.eventId(),
        event.userId(),
        event.email());

    sendWelcomeEmailCommand.execute(
        new SendWelcomeEmailCommand.Input(event.userId(), event.email()));
  }
}
