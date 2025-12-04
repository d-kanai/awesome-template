package com.example.demo.shared.event;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * CommandEvent（モジュール間通信）のインターフェース.
 *
 * <p>他モジュールへの指示を表す。 Spring Event / Kafka で publish され、対象モジュールが受信して処理する。
 *
 * <p>DomainEvent との違い:
 *
 * <ul>
 *   <li>DomainEvent: 「何が起きたか」を通知（過去形: UserSignedUp）- 発信元が payload を定義
 *   <li>CommandEvent: 「何をしてほしいか」を指示（命令形: SendEmail）- 受信側が payload を定義
 * </ul>
 */
public interface CommandEvent {

  /** イベントの一意識別子. */
  UUID eventId();

  /** イベント発生時刻（JST）. */
  OffsetDateTime eventAt();

  /** CommandEvent名（トピック名解決に使用）. */
  CommandEventName commandEventName();
}
