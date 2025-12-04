package com.example.demo.features.notification.internal.presentation.consumer;

import static com.example.demo.features.notification.expose.NotificationCommandEventEnum.Values.SEND_SLACK_NOTIFICATION;

import com.example.demo.features.notification.expose.SendSlackNotificationCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendSlackNotificationCommand;
import com.example.demo.shared.kafka.KafkaTopics;
import com.example.demo.shared.kafka.consumer.KafkaConsumerLogging;
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

  public SendSlackNotificationConsumer(
      final SendSlackNotificationCommand sendSlackNotificationCommand) {
    this.sendSlackNotificationCommand = sendSlackNotificationCommand;
  }

  @KafkaListener(
      topics = KafkaTopics.PREFIX + SEND_SLACK_NOTIFICATION,
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  @KafkaConsumerLogging(eventType = SEND_SLACK_NOTIFICATION)
  public void consume(final SendSlackNotificationCommandEventInput command) {
    sendSlackNotificationCommand.execute(command);
  }
}
