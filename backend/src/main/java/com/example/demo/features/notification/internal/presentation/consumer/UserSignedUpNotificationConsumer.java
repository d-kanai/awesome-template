package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.internal.application.command.SendWelcomeEmailCommand;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/** ユーザー登録イベントを受信し、ウェルカムメールを送信するコンシューマ. */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class UserSignedUpNotificationConsumer {

  private static final Logger log = LoggerFactory.getLogger(UserSignedUpNotificationConsumer.class);

  private final SendWelcomeEmailCommand sendWelcomeEmailCommand;

  public UserSignedUpNotificationConsumer(final SendWelcomeEmailCommand sendWelcomeEmailCommand) {
    this.sendWelcomeEmailCommand = sendWelcomeEmailCommand;
  }

  @KafkaListener(
      topics = "demo.user.events",
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  public void consume(final UserSignedUpEvent event) {
    log.info(
        "Received UserSignedUpEvent: eventId={}, userId={}, email={}",
        event.eventId(),
        event.userId(),
        event.email());

    sendWelcomeEmailCommand.execute(
        new SendWelcomeEmailCommand.Input(event.userId(), event.email()));
  }
}
