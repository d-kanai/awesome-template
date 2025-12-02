package com.example.demo.features.user.internal.domain.event;

import com.example.demo.shared.event.EventType;

/** ユーザー関連のイベントタイプ. */
public enum UserEventType implements EventType {
  USER_SIGNED_UP("user.signed_up"),
  ;

  private final String value;

  UserEventType(final String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }
}
