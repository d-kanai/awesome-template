package com.example.demo.features.test.internal.application.command;

import static com.example.demo.shared.jooq.tables.Users.USERS;

import java.util.UUID;
import org.jooq.DSLContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
public class SetupDataCommand {

  /** E2Eテスト用の固定ユーザーID (test tokenのclaimと一致). */
  private static final UUID E2E_TEST_USER_ID =
      UUID.fromString("00000000-0000-0000-0000-000000000000");

  /** E2Eテスト用のテストユーザーメールアドレス. */
  private static final String E2E_TEST_EMAIL = "test@example.com";

  /** E2Eテスト用のテストユーザーパスワード. */
  private static final String E2E_TEST_PASSWORD = "TestPassword123";

  private final DSLContext dsl;

  public SetupDataCommand(final DSLContext dsl) {
    this.dsl = dsl;
  }

  public Output execute(final Input input) {
    final String tableName = input.tableName();

    switch (tableName.toLowerCase()) {
      case "user":
      case "users":
        setupUserData();
        break;
      default:
        throw new IllegalArgumentException("Unsupported table: " + tableName);
    }

    return new Output();
  }

  private void setupUserData() {
    dsl.insertInto(USERS)
        .set(USERS.ID, E2E_TEST_USER_ID)
        .set(USERS.EMAIL, E2E_TEST_EMAIL)
        .set(USERS.PASSWORD, E2E_TEST_PASSWORD)
        .execute();
  }

  public record Input(String tableName) {}

  public record Output() {}
}
