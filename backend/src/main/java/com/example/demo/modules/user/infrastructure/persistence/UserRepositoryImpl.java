package com.example.demo.modules.user.infrastructure.persistence;

import com.example.demo.infrastructure.jooq.tables.Users;
import com.example.demo.infrastructure.jooq.tables.records.UsersRecord;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.value_object.UserId;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final DSLContext dsl;
    private final Users USERS = Users.USERS;

    public UserRepositoryImpl(final DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<User> findAll() {
        return dsl.selectFrom(USERS)
                .fetch(this::mapToUser);
    }

    @Override
    public Optional<User> findById(final UserId id) {
        return dsl.selectFrom(USERS)
                .where(USERS.ID.eq(id.getValue()))
                .fetchOptional(this::mapToUser);
    }

    @Override
    public Optional<User> findByEmail(final String email) {
        return dsl.selectFrom(USERS)
                .where(USERS.EMAIL.eq(email))
                .fetchOptional(this::mapToUser);
    }

    @Override
    public boolean existsById(final UserId id) {
        return dsl.fetchExists(
                dsl.selectFrom(USERS)
                        .where(USERS.ID.eq(id.getValue()))
        );
    }

    @Override
    public boolean existsByEmail(final String email) {
        return dsl.fetchExists(
                dsl.selectFrom(USERS)
                        .where(USERS.EMAIL.eq(email))
        );
    }

    @Override
    public User save(final User user) {
        final boolean exists = user.getId() != null && existsById(user.getId());
        if (!exists) {
            final LocalDateTime createdAt = user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now();
            final LocalDateTime updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt() : createdAt;

            final UsersRecord record = dsl.insertInto(USERS)
                    .set(USERS.ID, user.getId().getValue())
                    .set(USERS.EMAIL, user.getEmail())
                    .set(USERS.NAME, user.getName())
                    .set(USERS.CREATED_AT, createdAt)
                    .set(USERS.UPDATED_AT, updatedAt)
                    .returning()
                    .fetchOne();

            return mapToUser(record);
        }

        dsl.update(USERS)
                .set(USERS.EMAIL, user.getEmail())
                .set(USERS.NAME, user.getName())
                .set(USERS.UPDATED_AT, user.getUpdatedAt() != null ? user.getUpdatedAt() : LocalDateTime.now())
                .where(USERS.ID.eq(user.getId().getValue()))
                .execute();

        return findById(user.getId()).orElseThrow();
    }

    @Override
    public void deleteById(final UserId id) {
        dsl.deleteFrom(USERS)
                .where(USERS.ID.eq(id.getValue()))
                .execute();
    }

    private User mapToUser(final UsersRecord record) {
        return User.reconstruct(
                UserId.reconstruct(record.getId()),
                record.getEmail(),
                record.getName(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
