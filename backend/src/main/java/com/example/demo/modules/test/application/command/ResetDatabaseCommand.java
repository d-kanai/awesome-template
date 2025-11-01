package com.example.demo.modules.test.application.command;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.impl.DSL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
public class ResetDatabaseCommand {

  private static final Logger logger = LoggerFactory.getLogger(ResetDatabaseCommand.class);
  private static final Set<String> TARGET_SCHEMAS = Set.of("public");
  private static final Set<String> EXCLUDED_TABLES = Set.of("flyway_schema_history");

  private final DSLContext dsl;

  public ResetDatabaseCommand(final DSLContext dsl) {
    this.dsl = dsl;
  }

  public void execute() {
    logger.info("Starting database reset");
    dsl.transaction(
        configuration -> {
          final DSLContext transactionalDsl = DSL.using(configuration);
          final List<Table<?>> targetTables =
              transactionalDsl.meta().getTables().stream()
                  .filter(this::isApplicationTable)
                  .toList();

          if (targetTables.isEmpty()) {
            logger.info("No tables to reset");
            return;
          }

          logger.info(
              "Resetting {} tables: {}",
              targetTables.size(),
              targetTables.stream().map(Table::getName).collect(Collectors.joining(", ")));

          final SQLDialect dialect = configuration.dialect();
          switch (dialect.family()) {
            case POSTGRES:
              final String tableList =
                  targetTables.stream()
                      .map(transactionalDsl::render)
                      .collect(Collectors.joining(", "));
              transactionalDsl.execute("TRUNCATE TABLE " + tableList + " RESTART IDENTITY CASCADE");
              logger.info("Executed TRUNCATE for PostgreSQL");
              break;
            case H2:
              transactionalDsl.execute("SET REFERENTIAL_INTEGRITY FALSE");
              try {
                for (final Table<?> table : targetTables) {
                  transactionalDsl.execute("TRUNCATE TABLE " + transactionalDsl.render(table));
                }
                logger.info("Executed TRUNCATE for H2");
              } finally {
                transactionalDsl.execute("SET REFERENTIAL_INTEGRITY TRUE");
              }
              break;
            default:
              targetTables.forEach(table -> transactionalDsl.deleteFrom(table).execute());
              logger.info("Executed DELETE for default dialect");
              break;
          }
        });
    logger.info("Database reset completed");
  }

  private boolean isApplicationTable(final Table<?> table) {
    final Schema schema = table.getSchema();
    if (schema == null) {
      return false;
    }

    final String schemaName = schema.getName();
    if (schemaName == null || !TARGET_SCHEMAS.contains(schemaName.toLowerCase(Locale.ROOT))) {
      return false;
    }

    final String tableName = table.getName();
    return tableName != null && !EXCLUDED_TABLES.contains(tableName.toLowerCase(Locale.ROOT));
  }
}
