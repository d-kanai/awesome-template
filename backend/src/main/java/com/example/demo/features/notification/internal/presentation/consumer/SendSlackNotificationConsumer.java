package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.expose.SendSlackNotificationCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendSlackNotificationCommand;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka による SendSlackNotificationCommandEventInput を受信するコンシューマ.
 *
 * <p>Command パターン: 他モジュールから「このSlack通知を送れ」という指示を受け取り、そのまま送信する。 通知内容は呼び出し側が決定済みのため、notification
 * module はビジネスロジックを持たない。
 */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class SendSlackNotificationConsumer {

  private final SendSlackNotificationCommand sendSlackNotificationCommand;
  private final AppLogger appLogger;

  public SendSlackNotificationConsumer(
      final SendSlackNotificationCommand sendSlackNotificationCommand, final AppLogger appLogger) {
    this.sendSlackNotificationCommand = sendSlackNotificationCommand;
    this.appLogger = appLogger;
  }

  @KafkaListener(
      topics = "demo.notification.command-event.send-slack-notification",
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  public void consume(final SendSlackNotificationCommandEventInput command) {
    appLogger.logCommandEventReceive(
        SendSlackNotificationConsumer.class,
        "kafka",
        command.commandEventName().getValue(),
        Map.of(
            "eventId", command.eventId(),
            "eventAt", command.eventAt(),
            "channel", command.channel(),
            "notificationType", command.notificationType(),
            "userId", command.userId() != null ? command.userId() : "null"));

    sendSlackNotificationCommand.execute(command);
  }
}
