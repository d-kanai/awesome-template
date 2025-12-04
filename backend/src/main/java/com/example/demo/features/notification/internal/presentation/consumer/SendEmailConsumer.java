package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendEmailCommand;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka による SendEmailCommandEventInput を受信するコンシューマ.
 *
 * <p>Command パターン: 他モジュールから「このメールを送れ」という指示を受け取り、そのまま送信する。 メール内容（subject,
 * body）は呼び出し側が決定済みのため、notification module はビジネスロジックを持たない。
 */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class SendEmailConsumer {

  private final SendEmailCommand sendEmailCommand;
  private final AppLogger appLogger;

  public SendEmailConsumer(final SendEmailCommand sendEmailCommand, final AppLogger appLogger) {
    this.sendEmailCommand = sendEmailCommand;
    this.appLogger = appLogger;
  }

  @KafkaListener(
      topics = "demo.notification.command-event.send-email",
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  public void consume(final SendEmailCommandEventInput command) {
    appLogger.logCommandEventReceive(
        SendEmailConsumer.class,
        "kafka",
        command.commandEventName().getValue(),
        Map.of(
            "eventId", command.eventId(),
            "eventAt", command.eventAt(),
            "userId", command.userId(),
            "to", command.to(),
            "subject", command.subject(),
            "emailType", command.emailType()));

    sendEmailCommand.execute(command);
  }
}
