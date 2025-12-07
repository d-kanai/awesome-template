package com.example.demo.features.customer.user.internal.domain.event;

import com.example.demo.shared.event.DomainEventName;

/** ユーザー関連のドメインイベント名. */
public enum UserEventEnum implements DomainEventName {
  USER_SIGNED_UP("user.signed_up"),
  ;

  private final String value;

  UserEventEnum(final String value) {
    this.value = value;
  }

  @Override
  public String getValue() {
    return value;
  }
}
