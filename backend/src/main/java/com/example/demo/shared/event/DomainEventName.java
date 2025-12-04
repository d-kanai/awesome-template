package com.example.demo.shared.event;

/** ドメインイベント名のインターフェース. 各featureで具体的なenumを定義する. */
public interface DomainEventName {

  /** イベント名の値（トピック名解決に使用）. */
  String getValue();
}
