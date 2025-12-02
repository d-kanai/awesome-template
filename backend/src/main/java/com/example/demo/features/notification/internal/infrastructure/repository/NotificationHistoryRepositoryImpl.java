package com.example.demo.features.notification.internal.infrastructure.repository;

import static com.example.demo.shared.jooq.tables.NotificationHistories.NOTIFICATION_HISTORIES;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class NotificationHistoryRepositoryImpl implements NotificationHistoryRepository {

  private final DSLContext dsl;

  public NotificationHistoryRepositoryImpl(final DSLContext dsl) {
    this.dsl = dsl;
  }

  @Override
  public boolean insertIfNotExists(final NotificationHistory history) {
    final int affected =
        dsl.insertInto(NOTIFICATION_HISTORIES)
            .set(NOTIFICATION_HISTORIES.ID, history.getId().getValue())
            .set(NOTIFICATION_HISTORIES.USER_ID, history.getUserId())
            .set(NOTIFICATION_HISTORIES.EVENT_TYPE, history.getEventType())
            .set(NOTIFICATION_HISTORIES.CREATED_AT, history.getCreatedAt())
            .onDuplicateKeyIgnore()
            .execute();

    return affected > 0;
  }
}
