package com.example.demo.shared.event;

import com.example.demo.shared.kafka.KafkaTopics;

/** CommandEvent名のインターフェース. 各featureで具体的なenumを定義する. */
public interface CommandEventName {

  /** イベント名の値（トピック名解決に使用）. */
  String getValue();

  /**
   * このイベントが発行されるKafkaトピック名を返す.
   *
   * <p>デフォルト実装: getValue()の値をそのままトピック名に使用。 例: "notification.command-event.send-email" →
   * "demo.notification.command-event.send-email"
   *
   * <p>カスタムトピックが必要な場合はこのメソッドをオーバーライドする。
   *
   * @return Kafkaトピック名
   */
  default String getTopic() {
    return KafkaTopics.PREFIX + getValue();
  }
}
