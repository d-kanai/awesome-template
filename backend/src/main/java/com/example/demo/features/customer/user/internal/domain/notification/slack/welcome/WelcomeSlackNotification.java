package com.example.demo.features.customer.user.internal.domain.notification.slack.welcome;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.notification.expose.SendSlackNotificationCommandEventInput;
import org.springframework.stereotype.Component;

/**
 * Welcome Slack通知定義.
 *
 * <p>ユーザー登録完了時に送信されるSlack通知（内部運用通知用）。
 */
@Component
public class WelcomeSlackNotification {

  private static final String CHANNEL = "#user-signups";
  private static final String TEXT_TEMPLATE = ":tada: 新規ユーザー登録: %s";
  private static final String NOTIFICATION_TYPE = "welcome_slack";

  /**
   * ユーザー情報から SendSlackNotificationCommandEventInput コマンドを生成.
   *
   * @param user 対象ユーザー
   * @return Slack通知送信コマンド
   */
  public SendSlackNotificationCommandEventInput create(final User user) {
    final String text = TEXT_TEMPLATE.formatted(user.getEmail());
    return SendSlackNotificationCommandEventInput.ofUser(
        CHANNEL, text, NOTIFICATION_TYPE, user.getId().getValue());
  }
}
