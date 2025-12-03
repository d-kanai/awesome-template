package com.example.demo.features.notification.internal.domain.repository;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import java.util.UUID;

public interface NotificationHistoryRepository {

  /** 指定のユーザーとイベントタイプの履歴が存在するかチェック. */
  boolean existsByUserIdAndEventType(UUID userId, String eventType);

  /** 履歴を挿入する. */
  void insert(NotificationHistory history);
}
