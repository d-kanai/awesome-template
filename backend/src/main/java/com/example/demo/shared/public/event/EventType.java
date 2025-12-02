package com.example.demo.shared.event;

/** イベントタイプのインターフェース. 各featureで具体的なenumを定義する. */
public interface EventType {

  /** イベントタイプの値（トピック名解決に使用）. */
  String getValue();
}
