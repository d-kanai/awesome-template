package com.example.demo.features.notification.internal.domain.repository;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;

public interface NotificationHistoryRepository {
  /**
   * 履歴を挿入する（重複時は無視）.
   *
   * @return true: 挿入成功, false: 既に存在（重複）
   */
  boolean insertIfNotExists(NotificationHistory history);
}
