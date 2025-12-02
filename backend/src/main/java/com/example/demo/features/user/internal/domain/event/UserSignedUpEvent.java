package com.example.demo.features.user.internal.domain.event;

import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventMetadata;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ユーザー登録完了イベント.
 *
 * @param metadata イベントメタデータ
 * @param userId ユーザーID
 * @param email メールアドレス
 */
public record UserSignedUpEvent(EventMetadata metadata, UUID userId, String email)
    implements DomainEvent {

  public static final String EVENT_TYPE = "user.signed_up";

  /**
   * イベントを生成する.
   *
   * @param userId ユーザーID
   * @param email メールアドレス
   * @return 生成されたイベント
   */
  public static UserSignedUpEvent of(final UUID userId, final String email) {
    return new UserSignedUpEvent(
        EventMetadata.create("user-service", UUID.randomUUID().toString()), userId, email);
  }

  @Override
  public UUID eventId() {
    return metadata.eventId();
  }

  @Override
  public OffsetDateTime occurredAt() {
    return metadata.occurredAt();
  }

  @Override
  public String eventType() {
    return EVENT_TYPE;
  }
}
