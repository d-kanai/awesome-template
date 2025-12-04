package com.example.demo.shared.kafka.consumer;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Kafkaコンシューマのメソッドに付与し、command_event_receive / command_event_finish ログを自動出力する.
 *
 * <p>AOPにより、メソッド実行前後で自動的にログが出力される。
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface KafkaConsumerLogging {

  /** イベントタイプ（例: "notification.command-event.send-email"）. */
  String eventType();
}
