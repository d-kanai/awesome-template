package com.example.demo.features.notification.internal.infrastructure.email;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.logging.AppLogger;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

/**
 * メール送信インフラストラクチャ.
 *
 * <p>現在はログ出力のみ。将来的に SES, SendGrid 等の実装に置き換える。
 */
@Component
public class EmailSender {

  private final AppProperties appProperties;
  private final AppLogger appLogger;

  public EmailSender(final AppProperties appProperties, final AppLogger appLogger) {
    this.appProperties = appProperties;
    this.appLogger = appLogger;
  }

  /**
   * メールを送信する.
   *
   * @param eventId イベントID（ログ用）
   * @param to 宛先リスト
   * @param subject 件名
   * @param body 本文
   * @param emailType メールタイプ
   * @param from 送信元（null の場合はデフォルト値）
   * @param replyTo 返信先（null の場合はデフォルト値）
   * @param cc CCリスト
   * @param bcc BCCリスト
   */
  public void send(
      final UUID eventId,
      final List<String> to,
      final String subject,
      final String body,
      final String emailType,
      @Nullable final String from,
      @Nullable final String replyTo,
      final List<String> cc,
      final List<String> bcc) {

    final var emailConfig = appProperties.getEmail();
    final String actualFrom = Optional.ofNullable(from).orElse(emailConfig.getFrom());
    final String actualReplyTo = Optional.ofNullable(replyTo).orElse(emailConfig.getReplyTo());

    // TODO: 実際のメール送信実装（SES, SendGrid など）
    appLogger.logEmailSend(
        EmailSender.class,
        Map.of(
            "eventId", eventId,
            "from", actualFrom,
            "replyTo", actualReplyTo,
            "to", to,
            "cc", cc,
            "bcc", bcc,
            "subject", subject,
            "emailType", emailType));
  }
}
