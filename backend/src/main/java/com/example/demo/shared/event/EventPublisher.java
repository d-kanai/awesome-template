package com.example.demo.shared.event;

import java.util.List;

/**
 * イベント発行インターフェース.
 *
 * <p>DomainEvent と CommandEvent の両方を発行可能。 実装は Kafka または Spring Event を使用する。
 *
 * <p>使い分け:
 *
 * <ul>
 *   <li>DomainEvent: 「何が起きたか」という事実を通知（複数購読者）
 *   <li>CommandEvent: 「何をしてほしいか」という指示を送信（単一購読者）
 * </ul>
 */
public interface EventPublisher {

  /**
   * DomainEvent を発行する.
   *
   * @param event 発行するイベント
   */
  void publishDomainEvent(DomainEvent event);

  /**
   * 複数の DomainEvent を発行する.
   *
   * @param events 発行するイベントのリスト
   */
  default void publishAllDomainEvents(final List<DomainEvent> events) {
    for (final DomainEvent event : events) {
      publishDomainEvent(event);
    }
  }

  /**
   * CommandEvent を発行する.
   *
   * @param event 発行するイベント
   */
  void publishCommandEvent(CommandEvent event);
}
