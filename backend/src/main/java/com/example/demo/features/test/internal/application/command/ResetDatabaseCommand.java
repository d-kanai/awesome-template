package com.example.demo.features.test.internal.application.command;

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
          final DSLContext ctx = DSL.using(configuration);
          final List<Table<?>> tables = findTargetTables(ctx);
          if (tables.isEmpty()) {
            logger.info("No tables to reset");
            return;
          }
          logTargetTables(tables);
          truncateTables(ctx, tables, configuration.dialect());
        });
    logger.info("Database reset completed");
  }

  private List<Table<?>> findTargetTables(final DSLContext ctx) {
    return ctx.meta().getTables().stream().filter(this::isApplicationTable).toList();
  }

  private void logTargetTables(final List<Table<?>> tables) {
    logger.info(
        "Resetting {} tables: {}",
        tables.size(),
        tables.stream().map(Table::getName).collect(Collectors.joining(", ")));
  }

  private void truncateTables(
      final DSLContext ctx, final List<Table<?>> tables, final SQLDialect dialect) {
    switch (dialect.family()) {
      case POSTGRES -> truncatePostgres(ctx, tables);
      case H2 -> truncateH2(ctx, tables);
      default -> deleteAll(ctx, tables);
    }
  }

  private void truncatePostgres(final DSLContext ctx, final List<Table<?>> tables) {
    final String tableList = tables.stream().map(ctx::render).collect(Collectors.joining(", "));
    ctx.execute("TRUNCATE TABLE " + tableList + " RESTART IDENTITY CASCADE");
    logger.info("Executed TRUNCATE for PostgreSQL");
  }

  private void truncateH2(final DSLContext ctx, final List<Table<?>> tables) {
    ctx.execute("SET REFERENTIAL_INTEGRITY FALSE");
    try {
      for (final Table<?> table : tables) {
        ctx.execute("TRUNCATE TABLE " + ctx.render(table));
      }
      logger.info("Executed TRUNCATE for H2");
    } finally {
      ctx.execute("SET REFERENTIAL_INTEGRITY TRUE");
    }
  }

  private void deleteAll(final DSLContext ctx, final List<Table<?>> tables) {
    tables.forEach(table -> ctx.deleteFrom(table).execute());
    logger.info("Executed DELETE for default dialect");
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
