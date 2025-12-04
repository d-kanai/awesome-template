package com.example.demo.features.notification.expose;

import com.example.demo.shared.event.CommandEventName;

/** notification関連のCommandEvent名. */
public enum NotificationCommandEventEnum implements CommandEventName {
  SEND_EMAIL("notification.command-event.send-email"),
  SEND_PUSH_NOTIFICATION("notification.command-event.send-push-notification"),
  ;

  private final String value;

  NotificationCommandEventEnum(final String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }
}
