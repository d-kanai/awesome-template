package com.example.demo.features.notification.internal.infrastructure.email;

import java.util.List;
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

    // TODO: 実際のメール送信実装（SES, SendGrid など）
    // from/replyTo は null の場合 AppProperties のデフォルト値を使用する
    // ログは KafkaConsumerLogging AOP で出力されるため、ここでは省略
  }
}
