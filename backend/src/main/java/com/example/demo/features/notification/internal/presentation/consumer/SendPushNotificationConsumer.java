package com.example.demo.features.notification.internal.presentation.consumer;

import static com.example.demo.features.notification.expose.NotificationCommandEventEnum.Values.SEND_PUSH_NOTIFICATION;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendPushNotificationCommand;
import com.example.demo.shared.kafka.KafkaTopics;
import com.example.demo.shared.kafka.consumer.KafkaConsumerLogging;
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

  public SendPushNotificationConsumer(
      final SendPushNotificationCommand sendPushNotificationCommand) {
    this.sendPushNotificationCommand = sendPushNotificationCommand;
  }

  @KafkaListener(
      topics = KafkaTopics.PREFIX + SEND_PUSH_NOTIFICATION,
      groupId = "${spring.application.name}-notification",
      containerFactory = "kafkaListenerContainerFactory")
  @KafkaConsumerLogging(eventType = SEND_PUSH_NOTIFICATION)
  public void consume(final SendPushNotificationCommandEventInput command) {
    sendPushNotificationCommand.execute(command);
  }
}
