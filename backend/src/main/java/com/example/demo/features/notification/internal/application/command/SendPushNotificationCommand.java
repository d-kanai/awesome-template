package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.notification.internal.infrastructure.push.PushNotificationSender;
import org.springframework.stereotype.Service;

/**
 * プッシュ通知送信コマンド（Spring Event パターン用）.
 *
 * <p>SendPushNotificationCommandEventInput を受け取り、プッシュ通知を送信する。
 * 通知内容は呼び出し側が決定済みのため、このクラスはビジネスロジックを持たない。
 *
 * <p>Spring Event は at-most-once のため、idempotency チェック不要。 将来 Kafka に移行する場合は、AdvisoryLock +
 * NotificationHistory による idempotency チェックを追加する。
 */
@Service
public class SendPushNotificationCommand {

  private final PushNotificationSender pushNotificationSender;

  public SendPushNotificationCommand(final PushNotificationSender pushNotificationSender) {
    this.pushNotificationSender = pushNotificationSender;
  }

  public void execute(final SendPushNotificationCommandEventInput command) {
    pushNotificationSender.send(
        command.eventId(),
        command.userId(),
        command.deviceToken(),
        command.title(),
        command.body(),
        command.notificationType());
  }
}
