package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import com.example.demo.shared.infrastructure.AdvisoryLockService;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SendWelcomeEmailCommand {

  private static final Logger log = LoggerFactory.getLogger(SendWelcomeEmailCommand.class);
  private static final String EVENT_TYPE_WELCOME_EMAIL = "welcome_email_sent";

  private final AdvisoryLockService advisoryLockService;
  private final NotificationHistoryRepository notificationHistoryRepository;

  public SendWelcomeEmailCommand(
      final AdvisoryLockService advisoryLockService,
      final NotificationHistoryRepository notificationHistoryRepository) {
    this.advisoryLockService = advisoryLockService;
    this.notificationHistoryRepository = notificationHistoryRepository;
  }

  @Transactional
  public Output execute(final Input input) {
    // 1. アドバイザリーロック取得 (トランザクション終了時に自動解放)
    advisoryLockService.acquireLock(input.userId());

    // 2. 既に送信済みかチェック
    final boolean alreadySent =
        notificationHistoryRepository.existsByUserIdAndEventType(
            input.userId(), EVENT_TYPE_WELCOME_EMAIL);

    if (alreadySent) {
      log.info("Welcome email already sent: userId={}", input.userId());
      return new Output(false);
    }

    // 3. メール送信 (失敗時は例外でロールバック)
    sendEmail(input.userId(), input.email());

    // 4. 送信成功後に履歴を記録
    final NotificationHistory history =
        NotificationHistory.create(input.userId(), EVENT_TYPE_WELCOME_EMAIL);
    notificationHistoryRepository.insert(history);

    return new Output(true);
  }

  private void sendEmail(final UUID userId, final String email) {
    // TODO: 実際のメール送信実装
    log.info("Welcome email sent: userId={}, email={}", userId, email);
  }

  public record Input(UUID userId, String email) {}

  public record Output(boolean sent) {}
}
