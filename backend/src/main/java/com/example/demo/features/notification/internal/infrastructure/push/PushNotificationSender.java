package com.example.demo.features.notification.internal.infrastructure.push;

import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * プッシュ通知送信インフラストラクチャ.
 *
 * <p>現在はログ出力のみ。将来的に FCM, APNs 等の実装に置き換える。
 */
@Component
public class PushNotificationSender {

  private final AppLogger appLogger;

  public PushNotificationSender(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  /**
   * プッシュ通知を送信する.
   *
   * @param eventId イベントID（ログ用）
   * @param userId ユーザーID
   * @param deviceToken デバイストークン
   * @param title 通知タイトル
   * @param body 通知本文
   * @param notificationType 通知タイプ
   */
  public void send(
      final UUID eventId,
      final UUID userId,
      final String deviceToken,
      final String title,
      final String body,
      final String notificationType) {

    // TODO: 実際のプッシュ通知送信実装（FCM, APNs など）
    appLogger.logPushNotificationSend(
        PushNotificationSender.class,
        Map.of(
            "eventId", eventId,
            "userId", userId,
            "deviceToken", deviceToken,
            "title", title,
            "notificationType", notificationType));
  }
}
