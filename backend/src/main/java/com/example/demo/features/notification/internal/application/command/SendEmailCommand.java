package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import com.example.demo.features.notification.internal.infrastructure.email.EmailSender;
import com.example.demo.shared.db.AdvisoryLockService;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * メール送信コマンド.
 *
 * <p>SendEmailCommandEventInput を受け取り、メールを送信する。 eventId ベースの冪等性チェックにより、Kafka の at-least-once
 * 配信による重複送信を防ぐ。
 */
@Service
public class SendEmailCommand {

  private final EmailSender emailSender;
  private final AdvisoryLockService advisoryLockService;
  private final NotificationHistoryRepository notificationHistoryRepository;
  private final AppLogger appLogger;

  public SendEmailCommand(
      final EmailSender emailSender,
      final AdvisoryLockService advisoryLockService,
      final NotificationHistoryRepository notificationHistoryRepository,
      final AppLogger appLogger) {
    this.emailSender = emailSender;
    this.advisoryLockService = advisoryLockService;
    this.notificationHistoryRepository = notificationHistoryRepository;
    this.appLogger = appLogger;
  }

  @Transactional
  public void execute(final SendEmailCommandEventInput command) {
    // 1. アドバイザリーロック取得 (トランザクション終了時に自動解放)
    advisoryLockService.acquireLock(command.eventId());

    // 2. 既に処理済みかチェック（冪等性）
    if (notificationHistoryRepository.existsByEventId(command.eventId())) {
      appLogger.logIdempotencySkip(
          SendEmailCommand.class,
          Map.of("eventId", command.eventId(), "emailType", command.emailType()));
      return;
    }

    // 3. メール送信
    emailSender.send(
        command.eventId(),
        command.to(),
        command.subject(),
        command.body(),
        command.emailType(),
        command.from(),
        command.replyTo(),
        command.cc(),
        command.bcc());

    // 4. 送信成功後に履歴を記録
    final NotificationHistory history =
        NotificationHistory.create(command.eventId(), command.emailType(), command.userId());
    notificationHistoryRepository.insert(history);
  }
}
