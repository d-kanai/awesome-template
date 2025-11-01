package com.example.demo.modules.test.application.command;

import static com.example.demo.infrastructure.jooq.tables.Users.USERS;

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
    final UUID userId = UUID.randomUUID();
    dsl.insertInto(USERS)
        .set(USERS.ID, userId)
        .set(USERS.EMAIL, "test@example.com")
        .set(USERS.PASSWORD, "TestPassword123")
        .execute();
    logger.info("Created user: test@example.com (id: {})", userId);
  }
}
