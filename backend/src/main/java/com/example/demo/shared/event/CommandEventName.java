package com.example.demo.shared.event;

/** CommandEvent名のインターフェース. 各featureで具体的なenumを定義する. */
public interface CommandEventName {

  /** イベント名の値（トピック名解決に使用）. */
  String getValue();
}
