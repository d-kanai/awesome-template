package com.example.demo.shared.time;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * アプリケーション全体で使用する時刻取得ユーティリティ.
 *
 * <p>テスト時は MockedStatic で時刻を固定可能。
 */
public final class AppClock {

  private static final ZoneId ZONE = ZoneId.of("Asia/Tokyo");
  private static final Clock CLOCK = Clock.system(ZONE);

  private AppClock() {}

  /** 現在時刻をInstantで取得. */
  public static Instant nowInstant() {
    return Instant.now(CLOCK);
  }

  /** 現在時刻をLocalDateTimeで取得. */
  public static LocalDateTime nowLocalDateTime() {
    return LocalDateTime.now(CLOCK);
  }

  /** 現在時刻をOffsetDateTimeで取得. */
  public static OffsetDateTime nowOffsetDateTime() {
    return OffsetDateTime.now(CLOCK);
  }

  /** 現在時刻をISO形式の文字列で取得. */
  public static String nowAsIsoString() {
    return nowOffsetDateTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  /** 指定されたエポックミリ秒をISO形式の文字列で変換. */
  public static String toIsoString(final long epochMillis) {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), CLOCK.getZone())
        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  /** 使用しているClockのZoneIdを取得. */
  public static ZoneId getZone() {
    return CLOCK.getZone();
  }
}
