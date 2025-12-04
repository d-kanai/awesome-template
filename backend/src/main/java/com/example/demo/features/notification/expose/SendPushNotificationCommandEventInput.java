package com.example.demo.features.notification.expose;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.EventMetadata;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * プッシュ通知送信のCommandEvent.
 *
 * <p>他モジュールから notification module への「このプッシュ通知を送れ」という指示。 通知内容（title, body）は呼び出し側が決定する。
 *
 * @param metadata イベントメタデータ
 * @param userId ユーザーID
 * @param deviceToken デバイストークン
 * @param title 通知タイトル
 * @param body 通知本文
 * @param notificationType 通知タイプ（"welcome" など、idempotency チェック用）
 */
public record SendPushNotificationCommandEventInput(
    EventMetadata metadata,
    UUID userId,
    String deviceToken,
    String title,
    String body,
    String notificationType)
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
    return NotificationCommandEventEnum.SEND_PUSH_NOTIFICATION;
  }

  /** プッシュ通知送信用ファクトリメソッド. */
  public static SendPushNotificationCommandEventInput of(
      final UUID userId,
      final String deviceToken,
      final String title,
      final String body,
      final String notificationType) {
    return new SendPushNotificationCommandEventInput(
        EventMetadata.create(), userId, deviceToken, title, body, notificationType);
  }
}
