package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 * メール送信コマンド（Spring Event パターン用）.
 *
 * <p>SendEmailCommandEventInput を受け取り、メールを送信する。 メール内容は呼び出し側が決定済みのため、このクラスはビジネスロジックを持たない。
 *
 * <p>Spring Event は at-most-once のため、idempotency チェック不要。 将来 Kafka に移行する場合は、AdvisoryLock +
 * NotificationHistory による idempotency チェックを追加する。
 */
@Service
public class SendEmailCommand {

  private final AppProperties appProperties;
  private final AppLogger appLogger;

  public SendEmailCommand(final AppProperties appProperties, final AppLogger appLogger) {
    this.appProperties = appProperties;
    this.appLogger = appLogger;
  }

  public void execute(final SendEmailCommandEventInput command) {
    sendEmail(command);
  }

  private void sendEmail(final SendEmailCommandEventInput command) {
    final var emailConfig = appProperties.getEmail();
    final String from = Optional.ofNullable(command.from()).orElse(emailConfig.getFrom());
    final String replyTo = Optional.ofNullable(command.replyTo()).orElse(emailConfig.getReplyTo());

    // TODO: 実際のメール送信実装（SES, SendGrid など）
    appLogger.logEmailSend(
        SendEmailCommand.class,
        Map.of(
            "eventId", command.eventId(),
            "from", from,
            "replyTo", replyTo,
            "to", command.to(),
            "cc", command.cc(),
            "bcc", command.bcc(),
            "subject", command.subject(),
            "emailType", command.emailType()));
  }
}
