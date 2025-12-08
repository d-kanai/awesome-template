package com.example.demo.shared.event;

import com.example.demo.shared.logging.MdcKeys;
import com.example.demo.shared.time.AppClock;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.slf4j.MDC;

/**
 * イベントの共通メタデータ.
 *
 * <p>DomainEvent と CommandEvent の両方で使用する。
 *
 * @param eventId イベントの一意識別子
 * @param eventAt イベント発生時刻（JST）
 * @param traceId トレースID（リクエスト追跡用）
 */
public record EventMetadata(UUID eventId, OffsetDateTime eventAt, String traceId) {

  /** メタデータを生成する（MDC から traceId を取得、なければ新規生成）. */
  public static EventMetadata create() {
    final String traceId = MDC.get(MdcKeys.TRACE_ID);
    return new EventMetadata(
        UUID.randomUUID(),
        AppClock.nowOffsetDateTime(),
        traceId != null ? traceId : UUID.randomUUID().toString());
  }
}
