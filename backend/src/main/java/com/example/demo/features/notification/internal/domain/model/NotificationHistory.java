package com.example.demo.features.notification.internal.domain.model;

import com.example.demo.features.notification.internal.domain.valueobject.NotificationHistoryId;
import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.time.AppClock;
import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationHistory extends DomainModel<NotificationHistory.Field> {

  public enum Field {}

  private final NotificationHistoryId id;
  private final UUID userId;
  private final String eventType;
  private final LocalDateTime createdAt;

  private NotificationHistory(
      final NotificationHistoryId id,
      final UUID userId,
      final String eventType,
      final LocalDateTime createdAt) {
    this.id = id;
    this.userId = userId;
    this.eventType = eventType;
    this.createdAt = createdAt;
  }

  public static NotificationHistory create(final UUID userId, final String eventType) {
    return new NotificationHistory(
        NotificationHistoryId.generate(), userId, eventType, AppClock.nowLocalDateTime());
  }

  public static NotificationHistory reconstruct(
      final NotificationHistoryId id,
      final UUID userId,
      final String eventType,
      final LocalDateTime createdAt) {
    return new NotificationHistory(id, userId, eventType, createdAt);
  }

  public NotificationHistoryId getId() {
    return id;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getEventType() {
    return eventType;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
