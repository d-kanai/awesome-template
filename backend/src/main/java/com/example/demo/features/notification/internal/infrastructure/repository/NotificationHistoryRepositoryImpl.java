package com.example.demo.features.notification.internal.infrastructure.repository;

import static com.example.demo.shared.jooq.tables.NotificationHistories.NOTIFICATION_HISTORIES;

import com.example.demo.features.notification.internal.domain.model.NotificationHistory;
import com.example.demo.features.notification.internal.domain.repository.NotificationHistoryRepository;
import com.example.demo.shared.infrastructure.RepositoryBase;
import com.example.demo.shared.jooq.tables.records.NotificationHistoriesRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class NotificationHistoryRepositoryImpl
    extends RepositoryBase<NotificationHistory, NotificationHistoriesRecord>
    implements NotificationHistoryRepository {

  public NotificationHistoryRepositoryImpl(final DSLContext dsl) {
    super(dsl);
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
