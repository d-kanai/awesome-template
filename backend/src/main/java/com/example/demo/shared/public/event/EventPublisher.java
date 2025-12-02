package com.example.demo.shared.event;

import java.util.List;

/**
 * イベント発行インターフェース.
 *
 * <p>Commandからイベントを発行する際に使用する。
 */
public interface EventPublisher {

  /**
   * イベントを発行する.
   *
   * @param event 発行するイベント
   */
  void publish(DomainEvent event);

  /**
   * 複数のイベントを発行する.
   *
   * @param events 発行するイベントのリスト
   */
  default void publishAll(final List<DomainEvent> events) {
    for (final DomainEvent event : events) {
      publish(event);
    }
  }
}
