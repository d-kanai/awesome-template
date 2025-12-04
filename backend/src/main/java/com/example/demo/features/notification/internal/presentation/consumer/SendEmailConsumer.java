package com.example.demo.features.notification.internal.presentation.consumer;

import static com.example.demo.features.notification.expose.NotificationCommandEventEnum.Values.SEND_EMAIL;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendEmailCommand;
import com.example.demo.shared.kafka.KafkaTopics;
import com.example.demo.shared.kafka.consumer.KafkaConsumerLogging;
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

  public SendEmailConsumer(final SendEmailCommand sendEmailCommand) {
    this.sendEmailCommand = sendEmailCommand;
  }

  @KafkaListener(
      topics = KafkaTopics.PREFIX + SEND_EMAIL,
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  @KafkaConsumerLogging(eventType = SEND_EMAIL)
  public void consume(final SendEmailCommandEventInput command) {
    sendEmailCommand.execute(command);
  }
}
