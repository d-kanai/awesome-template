package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendPushNotificationCommand;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Spring Event による SendPushNotificationCommandEventInput を受信するコンシューマ.
 *
 * <p>Command パターン: 他モジュールから「このプッシュ通知を送れ」という指示を受け取り、そのまま送信する。 通知内容（title,
 * body）は呼び出し側が決定済みのため、notification module はビジネスロジックを持たない。
 *
 * <p>Spring Event は at-most-once（最大1回）配信のため、idempotency チェック不要。 将来 Kafka に移行する場合は、notificationType
 * を使った idempotency チェックを追加する。
 */
@Component
public class SendPushNotificationConsumer {

  private final SendPushNotificationCommand sendPushNotificationCommand;
  private final AppLogger appLogger;

  public SendPushNotificationConsumer(
      final SendPushNotificationCommand sendPushNotificationCommand, final AppLogger appLogger) {
    this.sendPushNotificationCommand = sendPushNotificationCommand;
    this.appLogger = appLogger;
  }

  /**
   * SendPushNotificationCommandEventInput を受信してプッシュ通知送信を実行.
   *
   * <p>トランザクションコミット後に実行される（AFTER_COMMIT）。
   */
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void consume(final SendPushNotificationCommandEventInput command) {
    appLogger.logCommandEventReceive(
        SendPushNotificationConsumer.class,
        "spring",
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
