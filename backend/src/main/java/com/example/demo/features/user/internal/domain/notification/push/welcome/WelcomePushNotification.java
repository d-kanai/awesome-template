package com.example.demo.features.user.internal.domain.notification.push.welcome;

import com.example.demo.features.notification.expose.SendPushNotificationCommandEventInput;
import com.example.demo.features.user.internal.domain.model.User;
import org.springframework.stereotype.Component;

/**
 * Welcome プッシュ通知定義.
 *
 * <p>ユーザー登録完了時に送信されるプッシュ通知。
 */
@Component
public class WelcomePushNotification {

  private static final String TITLE = "ようこそ！";
  private static final String BODY_TEMPLATE = "%s さん、ご登録ありがとうございます！";
  private static final String NOTIFICATION_TYPE = "welcome_push";

  /**
   * ユーザー情報から SendPushNotificationCommandEventInput コマンドを生成.
   *
   * @param user 対象ユーザー
   * @param deviceToken デバイストークン
   * @return プッシュ通知送信コマンド
   */
  public SendPushNotificationCommandEventInput create(final User user, final String deviceToken) {
    final String body = BODY_TEMPLATE.formatted(user.getEmail());
    return SendPushNotificationCommandEventInput.of(
        user.getId().getValue(), deviceToken, TITLE, body, NOTIFICATION_TYPE);
  }
}
