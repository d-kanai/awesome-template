package com.example.demo.features.notification.internal.domain.valueobject;

import com.example.demo.shared.domain.ValueObject;
import com.example.demo.shared.exception.DomainLayerException;
import java.util.UUID;

public class NotificationHistoryId extends ValueObject<UUID> {
  private final UUID value;

  private NotificationHistoryId(final UUID value) {
    if (value == null) {
      throw new DomainLayerException("NotificationHistory id cannot be null");
    }
    this.value = value;
  }

  public static NotificationHistoryId generate() {
    return new NotificationHistoryId(UUID.randomUUID());
  }

  public static NotificationHistoryId reconstruct(final UUID value) {
    return new NotificationHistoryId(value);
  }

  public UUID getValue() {
    return value;
  }

  @Override
  protected UUID value() {
    return value;
  }
}
