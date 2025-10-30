package com.example.demo.modules.user.infrastructure.persistence;

import com.example.demo.infrastructure.jooq.tables.Users;
import com.example.demo.infrastructure.jooq.tables.records.UsersRecord;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final DSLContext dsl;
    private final Users USERS = Users.USERS;

    public UserRepositoryImpl(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public List<User> findAll() {
        return dsl.selectFrom(USERS)
                .fetch(this::mapToUser);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return dsl.selectFrom(USERS)
                .where(USERS.ID.eq(id))
                .fetchOptional(this::mapToUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return dsl.selectFrom(USERS)
                .where(USERS.EMAIL.eq(email))
                .fetchOptional(this::mapToUser);
    }

    @Override
    public boolean existsById(UUID id) {
        return dsl.fetchExists(
                dsl.selectFrom(USERS)
                        .where(USERS.ID.eq(id))
        );
    }

    @Override
    public boolean existsByEmail(String email) {
        return dsl.fetchExists(
                dsl.selectFrom(USERS)
                        .where(USERS.EMAIL.eq(email))
        );
    }

    @Override
    public User save(User user) {
        boolean exists = user.getId() != null && existsById(user.getId());
        if (!exists) {
            LocalDateTime createdAt = user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now();
            LocalDateTime updatedAt = user.getUpdatedAt() != null ? user.getUpdatedAt() : createdAt;

            UsersRecord record = dsl.insertInto(USERS)
                    .set(USERS.ID, user.getId())
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
                .where(USERS.ID.eq(user.getId()))
                .execute();

        return findById(user.getId()).orElseThrow();
    }

    @Override
    public void deleteById(UUID id) {
        dsl.deleteFrom(USERS)
                .where(USERS.ID.eq(id))
                .execute();
    }

    private User mapToUser(UsersRecord record) {
        return User.reconstruct(
                record.getId(),
                record.getEmail(),
                record.getName(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
