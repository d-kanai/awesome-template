package com.example.demo.features.notification.expose;

import com.example.demo.shared.event.CommandEventName;
import java.util.Locale;

/** notification関連のイベントタイプ. アノテーション用の定数フィールドも提供. */
public enum NotificationCommandEventEnum implements CommandEventName {
  SEND_EMAIL,
  SEND_PUSH_NOTIFICATION,
  SEND_SLACK_NOTIFICATION,
  ;

  private static final String PREFIX = "notification.command-event.";

  @Override
  public String getValue() {
    // SEND_EMAIL → send-email
    return PREFIX + name().toLowerCase(Locale.ROOT).replace('_', '-');
  }

  /** アノテーションで使用可能なコンパイル時定数. */
  public static final class Values {
    private static final String PREFIX = "notification.command-event.";
    public static final String SEND_EMAIL = PREFIX + "send-email";
    public static final String SEND_PUSH_NOTIFICATION = PREFIX + "send-push-notification";
    public static final String SEND_SLACK_NOTIFICATION = PREFIX + "send-slack-notification";

    private Values() {}
  }
}
