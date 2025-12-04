package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.notification.internal.infrastructure.email.EmailSender;
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

  private final EmailSender emailSender;

  public SendEmailCommand(final EmailSender emailSender) {
    this.emailSender = emailSender;
  }

  public void execute(final SendEmailCommandEventInput command) {
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
  }
}
