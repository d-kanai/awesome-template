package com.example.demo.features.notification.expose;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.EventMetadata;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.jspecify.annotations.Nullable;

/**
 * メール送信のCommandEvent.
 *
 * <p>他モジュールから notification module への「このメールを送れ」という指示。 メール内容（subject, body）は呼び出し側が決定する。
 *
 * @param metadata イベントメタデータ
 * @param userId ユーザーID（将来の idempotency チェック用）
 * @param to 送信先メールアドレスリスト
 * @param subject メール件名
 * @param body メール本文
 * @param emailType メールタイプ（"welcome_email" など、idempotency チェック用）
 * @param from 送信元メールアドレス（null の場合はデフォルト値を使用）
 * @param replyTo 返信先メールアドレス（null の場合はデフォルト値を使用）
 * @param cc CCアドレスリスト
 * @param bcc BCCアドレスリスト
 */
public record SendEmailCommandEventInput(
    EventMetadata metadata,
    UUID userId,
    List<String> to,
    String subject,
    String body,
    String emailType,
    @Nullable String from,
    @Nullable String replyTo,
    List<String> cc,
    List<String> bcc)
    implements CommandEvent {

  @Override
  public UUID eventId() {
    return metadata.eventId();
  }

  @Override
  public OffsetDateTime eventAt() {
    return metadata.eventAt();
  }

  @Override
  public NotificationCommandEventEnum commandEventName() {
    return NotificationCommandEventEnum.SEND_EMAIL;
  }

  /** 単一宛先のメール送信用ファクトリメソッド. */
  public static SendEmailCommandEventInput of(
      final UUID userId,
      final String to,
      final String subject,
      final String body,
      final String emailType) {
    return ofMultiple(userId, List.of(to), subject, body, emailType);
  }

  /** 複数宛先のメール送信用ファクトリメソッド. */
  public static SendEmailCommandEventInput ofMultiple(
      final UUID userId,
      final List<String> to,
      final String subject,
      final String body,
      final String emailType) {
    return withRecipients(userId, to, subject, body, emailType, List.of(), List.of());
  }

  /** 全宛先指定のメール送信用ファクトリメソッド. */
  public static SendEmailCommandEventInput withRecipients(
      final UUID userId,
      final List<String> to,
      final String subject,
      final String body,
      final String emailType,
      final List<String> cc,
      final List<String> bcc) {
    return new SendEmailCommandEventInput(
        EventMetadata.create(), userId, to, subject, body, emailType, null, null, cc, bcc);
  }
}
