package com.example.demo.features.notification.internal.domain.repository;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import java.util.UUID;

public interface NotificationHistoryRepository {

  /** 指定の eventId の履歴が存在するかチェック（冪等性チェック用）. */
  boolean existsByEventId(UUID eventId);

  /** 履歴を挿入する. */
  void insert(NotificationHistory history);
}
