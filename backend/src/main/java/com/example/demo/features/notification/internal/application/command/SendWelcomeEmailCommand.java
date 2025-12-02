package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SendWelcomeEmailCommand {

  private static final Logger log = LoggerFactory.getLogger(SendWelcomeEmailCommand.class);
  private static final String EVENT_TYPE_WELCOME_EMAIL = "welcome_email_sent";

  private final NotificationHistoryRepository notificationHistoryRepository;

  public SendWelcomeEmailCommand(
      final NotificationHistoryRepository notificationHistoryRepository) {
    this.notificationHistoryRepository = notificationHistoryRepository;
  }

  @Transactional
  public Output execute(final Input input) {
    // Insert-first: 先に履歴を挿入し、重複時はスキップ（競合状態を防ぐ）
    final NotificationHistory history =
        NotificationHistory.create(input.userId(), EVENT_TYPE_WELCOME_EMAIL);
    final boolean inserted = notificationHistoryRepository.insertIfNotExists(history);

    if (!inserted) {
      log.info("Welcome email already sent: userId={}", input.userId());
      return new Output(false);
    }

    sendEmail(input.userId(), input.email());
    return new Output(true);
  }

  private void sendEmail(final UUID userId, final String email) {
    // TODO: 実際のメール送信実装
    log.info("Welcome email sent: userId={}, email={}", userId, email);
  }

  public record Input(UUID userId, String email) {}

  public record Output(boolean sent) {}
}
