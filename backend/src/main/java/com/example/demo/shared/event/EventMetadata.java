package com.example.demo.shared.event;

import com.example.demo.shared.time.AppClock;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * イベントの共通メタデータ.
 *
 * <p>DomainEvent と CommandEvent の両方で使用する。
 *
 * @param eventId イベントの一意識別子
 * @param eventAt イベント発生時刻（JST）
 */
public record EventMetadata(UUID eventId, OffsetDateTime eventAt) {

  /** メタデータを生成する. */
  public static EventMetadata create() {
    return new EventMetadata(UUID.randomUUID(), AppClock.nowOffsetDateTime());
  }
}
