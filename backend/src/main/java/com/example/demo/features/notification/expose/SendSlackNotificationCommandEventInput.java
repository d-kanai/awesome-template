package com.example.demo.features.notification.expose;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.EventMetadata;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.jspecify.annotations.Nullable;

/**
 * Slack通知送信のCommandEvent.
 *
 * <p>他モジュールから notification module への「このSlack通知を送れ」という指示。 通知内容は呼び出し側が決定する。
 *
 * @param metadata イベントメタデータ
 * @param channel Slackチャンネル（例: "#general", "@user"）
 * @param text メッセージ本文
 * @param notificationType 通知タイプ（"user_signup" など、idempotency チェック用）
 * @param userId 関連ユーザーID（nullable、ログ用）
 */
public record SendSlackNotificationCommandEventInput(
    EventMetadata metadata,
    String channel,
    String text,
    String notificationType,
    @Nullable UUID userId)
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
    return NotificationCommandEventEnum.SEND_SLACK_NOTIFICATION;
  }

  /** Slack通知送信用ファクトリメソッド. */
  public static SendSlackNotificationCommandEventInput of(
      final String channel, final String text, final String notificationType) {
    return new SendSlackNotificationCommandEventInput(
        EventMetadata.create(), channel, text, notificationType, null);
  }

  /** ユーザー関連のSlack通知送信用ファクトリメソッド. */
  public static SendSlackNotificationCommandEventInput ofUser(
      final String channel, final String text, final String notificationType, final UUID userId) {
    return new SendSlackNotificationCommandEventInput(
        EventMetadata.create(), channel, text, notificationType, userId);
  }
}
