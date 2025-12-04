package com.example.demo.features.notification.internal.infrastructure.slack;

import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import java.util.UUID;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

/**
 * Slack通知送信インフラストラクチャ.
 *
 * <p>現在はログ出力のみ。将来的に Slack Web API の実装に置き換える。
 */
@Component
public class SlackNotificationSender {

  private final AppLogger appLogger;

  public SlackNotificationSender(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  /**
   * Slack通知を送信する.
   *
   * @param eventId イベントID（ログ用）
   * @param channel Slackチャンネル
   * @param text メッセージ本文
   * @param notificationType 通知タイプ
   * @param userId 関連ユーザーID（nullable）
   */
  public void send(
      final UUID eventId,
      final String channel,
      final String text,
      final String notificationType,
      @Nullable final UUID userId) {

    // TODO: 実際のSlack送信実装（Slack Web API）
    appLogger.logSlackNotificationSend(
        SlackNotificationSender.class,
        Map.of(
            "eventId", eventId,
            "channel", channel,
            "notificationType", notificationType,
            "userId", userId != null ? userId : "null"));
  }
}
