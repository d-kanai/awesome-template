package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.notification.internal.application.command.SendEmailCommand;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Spring Event による SendEmailCommandEventInput を受信するコンシューマ.
 *
 * <p>Command パターン: 他モジュールから「このメールを送れ」という指示を受け取り、そのまま送信する。 メール内容（subject,
 * body）は呼び出し側が決定済みのため、notification module はビジネスロジックを持たない。
 *
 * <p>Spring Event は at-most-once（最大1回）配信のため、idempotency チェック不要。 将来 Kafka に移行する場合は、emailType を使った
 * idempotency チェックを追加する。
 */
@Component
public class SendEmailConsumer {

  private final SendEmailCommand sendEmailCommand;
  private final AppLogger appLogger;

  public SendEmailConsumer(final SendEmailCommand sendEmailCommand, final AppLogger appLogger) {
    this.sendEmailCommand = sendEmailCommand;
    this.appLogger = appLogger;
  }

  /**
   * SendEmailCommandEventInput を受信してメール送信を実行.
   *
   * <p>トランザクションコミット後に実行される（AFTER_COMMIT）。
   */
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void consume(final SendEmailCommandEventInput command) {
    appLogger.logCommandEventReceive(
        SendEmailConsumer.class,
        "spring",
        command.commandEventName().getValue(),
        Map.of(
            "eventId", command.eventId(),
            "eventAt", command.eventAt(),
            "userId", command.userId(),
            "to", command.to(),
            "subject", command.subject(),
            "emailType", command.emailType()));

    sendEmailCommand.execute(command);
  }
}
