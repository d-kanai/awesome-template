package com.example.demo.features.customer.user.internal.infrastructure.repository;

import static com.example.demo.shared.jooq.tables.Users.USERS;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.exception.InfraLayerException;
import com.example.demo.shared.infrastructure.RepositoryBase;
import com.example.demo.shared.jooq.tables.records.UsersRecord;
import com.example.demo.shared.logging.DbRecordUpdateLog;
import java.util.List;
import java.util.Optional;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl extends RepositoryBase<User, UsersRecord>
    implements UserRepository {

  public UserRepositoryImpl(final DSLContext dsl) {
    super(dsl);
  }

  @Override
  public long count() {
    return dsl.fetchCount(USERS);
  }

  @Override
  public List<User> findAll() {
    return dsl.selectFrom(USERS).fetch(this::mapToUser);
  }

  @Override
  public User findById(final UserId id) {
    return dsl.selectFrom(USERS)
        .where(USERS.ID.eq(id.getValue()))
        .fetchOptional(this::mapToUser)
        .orElseThrow(() -> new InfraLayerException("User not found: " + id.getValue()));
  }

  @Override
  public Optional<User> findByEmail(final String email) {
    return dsl.selectFrom(USERS).where(USERS.EMAIL.eq(email)).fetchOptional(this::mapToUser);
  }

  @Override
  public boolean existsByEmail(final String email) {
    return dsl.fetchExists(dsl.selectFrom(USERS).where(USERS.EMAIL.eq(email)));
  }

  @Override
  public void insert(final User user) {
    final int affected =
        dsl.insertInto(USERS)
            .set(USERS.ID, user.getId().getValue())
            .set(USERS.EMAIL, user.getEmail())
            .set(USERS.PASSWORD, user.getPassword())
            .set(USERS.CREATED_AT, user.getCreatedAt())
            .set(USERS.UPDATED_AT, user.getUpdatedAt())
            .execute();

    if (affected == 0) {
      throw new InfraLayerException("Failed to insert user: " + user.getId().getValue());
    }
  }

  @DbRecordUpdateLog
  @Override
  public void update(final User user) {
    if (!user.hasChanges()) {
      return;
    }

    final var record = dsl.newRecord(USERS);
    setUpdateFields(user, record);

    final int affected =
        dsl.update(USERS).set(record).where(USERS.ID.eq(user.getId().getValue())).execute();

    if (affected == 0) {
      throw new InfraLayerException("User not found: " + user.getId().getValue());
    }
  }

  @Override
  public void deleteById(final UserId id) {
    dsl.deleteFrom(USERS).where(USERS.ID.eq(id.getValue())).execute();
  }

  private User mapToUser(final UsersRecord record) {
    return User.reconstruct(
        UserId.reconstruct(record.getId()),
        record.getEmail(),
        record.getPassword(),
        record.getCreatedAt(),
        record.getUpdatedAt());
  }
}
