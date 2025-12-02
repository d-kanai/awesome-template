package com.example.demo.shared.event;

import com.example.demo.shared.time.AppClock;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * イベントの共通メタデータ.
 *
 * @param eventId イベントの一意識別子
 * @param occurredAt イベント発生時刻（JST）
 * @param source イベント発生元サービス名
 * @param correlationId 関連リクエストの追跡ID
 */
public record EventMetadata(
    UUID eventId, OffsetDateTime occurredAt, String source, String correlationId) {

  /**
   * メタデータを生成する.
   *
   * @param source イベント発生元サービス名
   * @param correlationId 関連リクエストの追跡ID
   * @return 生成されたメタデータ
   */
  public static EventMetadata create(final String source, final String correlationId) {
    return new EventMetadata(
        UUID.randomUUID(), AppClock.nowOffsetDateTime(), source, correlationId);
  }
}
