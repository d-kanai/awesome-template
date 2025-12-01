package com.example.demo.features.test.internal.application.command;

import static com.example.demo.shared.jooq.tables.Users.USERS;

import java.util.UUID;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
public class SetupDataCommand {

  private static final Logger logger = LoggerFactory.getLogger(SetupDataCommand.class);

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

  public void execute(final String tableName) {
    logger.info("Setting up test data for table: {}", tableName);

    switch (tableName.toLowerCase()) {
      case "user":
      case "users":
        setupUserData();
        break;
      default:
        logger.warn("Unknown table name: {}", tableName);
        throw new IllegalArgumentException("Unsupported table: " + tableName);
    }

    logger.info("Test data setup completed for table: {}", tableName);
  }

  private void setupUserData() {
    logger.info("Creating default user record");
    dsl.insertInto(USERS)
        .set(USERS.ID, E2E_TEST_USER_ID)
        .set(USERS.EMAIL, E2E_TEST_EMAIL)
        .set(USERS.PASSWORD, E2E_TEST_PASSWORD)
        .execute();
    logger.info("Created user: {} (id: {})", E2E_TEST_EMAIL, E2E_TEST_USER_ID);
  }
}
