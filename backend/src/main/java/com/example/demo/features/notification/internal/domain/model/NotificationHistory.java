package com.example.demo.features.notification.internal.domain.model;

import com.example.demo.features.notification.internal.domain.valueobject.NotificationHistoryId;
import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.time.AppClock;
import java.time.LocalDateTime;
import java.util.UUID;
import org.jspecify.annotations.Nullable;

/**
 * 通知送信履歴.
 *
 * <p>Kafka の at-least-once 配信による重複処理を防ぐための履歴。 eventId をキーとして、同じ event からの重複配信をスキップする。
 */
public class NotificationHistory extends DomainModel {

  private final NotificationHistoryId id;
  private final UUID eventId;
  private final String eventType;
  @Nullable private final UUID userId;
  private final LocalDateTime createdAt;

  private NotificationHistory(
      final NotificationHistoryId id,
      final UUID eventId,
      final String eventType,
      @Nullable final UUID userId,
      final LocalDateTime createdAt) {
    this.id = id;
    this.eventId = eventId;
    this.eventType = eventType;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  /** eventId ベースで履歴を作成. */
  public static NotificationHistory create(
      final UUID eventId, final String eventType, @Nullable final UUID userId) {
    return new NotificationHistory(
        NotificationHistoryId.generate(), eventId, eventType, userId, AppClock.nowLocalDateTime());
  }

  public static NotificationHistory reconstruct(
      final NotificationHistoryId id,
      final UUID eventId,
      final String eventType,
      @Nullable final UUID userId,
      final LocalDateTime createdAt) {
    return new NotificationHistory(id, eventId, eventType, userId, createdAt);
  }

  public NotificationHistoryId getId() {
    return id;
  }

  public UUID getEventId() {
    return eventId;
  }

  public String getEventType() {
    return eventType;
  }

  @Nullable
  public UUID getUserId() {
    return userId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
