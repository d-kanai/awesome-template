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
 * <p>テスト時は {@link #setClock(Clock)} で固定時刻を設定可能。
 */
public final class AppClock {

  private static Clock clock = Clock.systemDefaultZone();

  private AppClock() {
    // utility class
  }

  /** テスト用: Clockを設定. */
  public static void setClock(final Clock clock) {
    AppClock.clock = clock;
  }

  /** テスト用: Clockをリセット. */
  public static void resetClock() {
    AppClock.clock = Clock.systemDefaultZone();
  }

  /** 現在時刻をInstantで取得. */
  public static Instant nowInstant() {
    return Instant.now(clock);
  }

  /** 現在時刻をLocalDateTimeで取得. */
  public static LocalDateTime nowLocalDateTime() {
    return LocalDateTime.now(clock);
  }

  /** 現在時刻をOffsetDateTimeで取得. */
  public static OffsetDateTime nowOffsetDateTime() {
    return OffsetDateTime.now(clock);
  }

  /** 現在時刻をISO形式の文字列で取得. */
  public static String nowAsIsoString() {
    return nowOffsetDateTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  /** 指定されたエポックミリ秒をISO形式の文字列で変換. */
  public static String toIsoString(final long epochMillis) {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), clock.getZone())
        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  /** 使用しているClockのZoneIdを取得. */
  public static ZoneId getZone() {
    return clock.getZone();
  }
}
