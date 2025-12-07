package com.example.demo.shared.event;

import com.example.demo.shared.kafka.KafkaTopics;

/** ドメインイベント名のインターフェース. 各featureで具体的なenumを定義する. */
public interface DomainEventName {

  /** イベント名の値（トピック名解決に使用）. */
  String getValue();

  /**
   * このイベントが発行されるKafkaトピック名を返す.
   *
   * <p>デフォルト実装: イベント名のプレフィックス（最初の '.' より前）から自動生成。 例: "user.signed_up" → "demo.user.events"
   *
   * <p>カスタムトピックが必要な場合はこのメソッドをオーバーライドする。
   *
   * @return Kafkaトピック名
   */
  default String getTopic() {
    final String value = getValue();
    final String prefix = value.substring(0, value.indexOf('.'));
    return KafkaTopics.PREFIX + prefix + ".events";
  }
}
