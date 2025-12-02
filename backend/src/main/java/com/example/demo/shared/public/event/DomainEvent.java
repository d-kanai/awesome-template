package com.example.demo.shared.event;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ドメインイベントの基底インターフェース.
 *
 * <p>全てのドメインイベントはこのインターフェースを実装する。
 */
public interface DomainEvent {

  /** イベントの一意識別子. */
  UUID eventId();

  /** イベント発生時刻（JST）. */
  OffsetDateTime occurredAt();

  /** イベントタイプ（トピック名解決に使用）. */
  EventType eventType();
}
