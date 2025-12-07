package com.example.demo.features.admin.auth.internal.infrastructure;

import static com.example.demo.shared.jooq.Tables.ADMINS;

import com.example.demo.features.admin.auth.internal.domain.model.Admin;
import com.example.demo.features.admin.auth.internal.domain.model.AdminId;
import com.example.demo.features.admin.auth.internal.domain.repository.AdminRepository;
import java.util.Optional;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
class AdminRepositoryImpl implements AdminRepository {

  private final DSLContext dsl;

  AdminRepositoryImpl(final DSLContext dsl) {
    this.dsl = dsl;
  }

  @Override
  public Optional<Admin> findByEmail(final String email) {
    return dsl.selectFrom(ADMINS)
        .where(ADMINS.EMAIL.eq(email))
        .fetchOptional()
        .map(
            record ->
                new Admin(
                    AdminId.of(record.getId()),
                    record.getEmail(),
                    record.getPassword(),
                    record.getCreatedAt(),
                    record.getUpdatedAt()));
  }
}
