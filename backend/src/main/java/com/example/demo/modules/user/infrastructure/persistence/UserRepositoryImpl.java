package com.example.demo.modules.user.infrastructure.persistence;

import com.example.demo.infrastructure.jooq.tables.Users;
import com.example.demo.infrastructure.jooq.tables.records.UsersRecord;
import com.example.demo.modules.user.domain.User;
import com.example.demo.modules.user.repository.UserRepository;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public Optional<User> findById(Long id) {
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
    public boolean existsById(Long id) {
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
        if (user.getId() == null) {
            // Insert new user
            LocalDateTime now = LocalDateTime.now();
            UsersRecord record = dsl.insertInto(USERS)
                    .set(USERS.EMAIL, user.getEmail())
                    .set(USERS.NAME, user.getName())
                    .set(USERS.CREATED_AT, now)
                    .set(USERS.UPDATED_AT, now)
                    .returning()
                    .fetchOne();

            return mapToUser(record);
        } else {
            // Update existing user
            dsl.update(USERS)
                    .set(USERS.EMAIL, user.getEmail())
                    .set(USERS.NAME, user.getName())
                    .set(USERS.UPDATED_AT, LocalDateTime.now())
                    .where(USERS.ID.eq(user.getId()))
                    .execute();

            return findById(user.getId()).orElseThrow();
        }
    }

    @Override
    public void deleteById(Long id) {
        dsl.deleteFrom(USERS)
                .where(USERS.ID.eq(id))
                .execute();
    }

    private User mapToUser(UsersRecord record) {
        return new User(
                record.getId(),
                record.getEmail(),
                record.getName(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
