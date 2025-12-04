package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendPushNotificationCommand;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka による SendPushNotificationCommandEventInput を受信するコンシューマ.
 *
 * <p>Command パターン: 他モジュールから「このプッシュ通知を送れ」という指示を受け取り、そのまま送信する。 通知内容（title,
 * body）は呼び出し側が決定済みのため、notification module はビジネスロジックを持たない。
 */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class SendPushNotificationConsumer {

  private final SendPushNotificationCommand sendPushNotificationCommand;
  private final AppLogger appLogger;

  public SendPushNotificationConsumer(
      final SendPushNotificationCommand sendPushNotificationCommand, final AppLogger appLogger) {
    this.sendPushNotificationCommand = sendPushNotificationCommand;
    this.appLogger = appLogger;
  }

  @KafkaListener(
      topics = "demo.notification.command-event.send-push-notification",
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  public void consume(final SendPushNotificationCommandEventInput command) {
    appLogger.logCommandEventReceive(
        SendPushNotificationConsumer.class,
        "kafka",
        command.commandEventName().getValue(),
        Map.of(
            "eventId", command.eventId(),
            "eventAt", command.eventAt(),
            "userId", command.userId(),
            "deviceToken", command.deviceToken(),
            "title", command.title(),
            "notificationType", command.notificationType()));

    sendPushNotificationCommand.execute(command);
  }
}
