package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import com.example.demo.features.notification.internal.infrastructure.push.PushNotificationSender;
import com.example.demo.shared.db.AdvisoryLockService;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * プッシュ通知送信コマンド.
 *
 * <p>SendPushNotificationCommandEventInput を受け取り、プッシュ通知を送信する。 eventId ベースの冪等性チェックにより、Kafka の
 * at-least-once 配信による重複送信を防ぐ。
 */
@Service
public class SendPushNotificationCommand {

  private final PushNotificationSender pushNotificationSender;
  private final AdvisoryLockService advisoryLockService;
  private final NotificationHistoryRepository notificationHistoryRepository;
  private final AppLogger appLogger;

  public SendPushNotificationCommand(
      final PushNotificationSender pushNotificationSender,
      final AdvisoryLockService advisoryLockService,
      final NotificationHistoryRepository notificationHistoryRepository,
      final AppLogger appLogger) {
    this.pushNotificationSender = pushNotificationSender;
    this.advisoryLockService = advisoryLockService;
    this.notificationHistoryRepository = notificationHistoryRepository;
    this.appLogger = appLogger;
  }

  @Transactional
  public void execute(final SendPushNotificationCommandEventInput command) {
    // 1. アドバイザリーロック取得 (トランザクション終了時に自動解放)
    advisoryLockService.acquireLock(command.eventId());

    // 2. 既に処理済みかチェック（冪等性）
    if (notificationHistoryRepository.existsByEventId(command.eventId())) {
      appLogger.logIdempotencySkip(
          SendPushNotificationCommand.class,
          Map.of("eventId", command.eventId(), "notificationType", command.notificationType()));
      return;
    }

    // 3. プッシュ通知送信
    pushNotificationSender.send(
        command.eventId(),
        command.userId(),
        command.deviceToken(),
        command.title(),
        command.body(),
        command.notificationType());

    // 4. 送信成功後に履歴を記録
    final NotificationHistory history =
        NotificationHistory.create(command.eventId(), command.notificationType(), command.userId());
    notificationHistoryRepository.insert(history);
  }
}
