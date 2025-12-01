package com.example.demo.user.internal.infrastructure.persistence;

import static com.example.demo.shared.jooq.tables.Users.USERS;

import com.example.demo.shared.jooq.tables.records.UsersRecord;
import com.example.demo.user.internal.domain.model.User;
import com.example.demo.user.internal.domain.repository.UserRepository;
import com.example.demo.user.internal.domain.valueobject.UserId;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

  private final DSLContext dsl;

  public UserRepositoryImpl(final DSLContext dsl) {
    this.dsl = dsl;
  }

  @Override
  public List<User> findAll() {
    return dsl.selectFrom(USERS).fetch(this::mapToUser);
  }

  @Override
  public Optional<User> findById(final UserId id) {
    return dsl.selectFrom(USERS).where(USERS.ID.eq(id.getValue())).fetchOptional(this::mapToUser);
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
  public User save(final User user) {
    final LocalDateTime createdAt =
        user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now();
    final LocalDateTime updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt() : createdAt;

    final UsersRecord record =
        dsl.insertInto(USERS)
            .set(USERS.ID, user.getId().getValue())
            .set(USERS.EMAIL, user.getEmail())
            .set(USERS.PASSWORD, user.getPassword())
            .set(USERS.CREATED_AT, createdAt)
            .set(USERS.UPDATED_AT, updatedAt)
            .returning()
            .fetchOne();

    return mapToUser(record);
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
