package com.example.demo.shared.logging;

import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.logging.AppLogger.DbUpdateLog;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * {@link DbRecordUpdateLog} アノテーションが付与されたメソッドの監査ログを出力するAspect.
 *
 * <p>DomainModelのdirty tracking情報を使用して、変更されたフィールドのold/new値をログに出力する。
 */
@Aspect
@Component
public class DbRecordUpdateLogAspect {

  private final ObjectProvider<AppLogger> appLoggerProvider;

  public DbRecordUpdateLogAspect(final ObjectProvider<AppLogger> appLoggerProvider) {
    this.appLoggerProvider = appLoggerProvider;
  }

  /** 変更内容. */
  public record Change(String oldValue, String newValue) {}

  /**
   * {@link DbRecordUpdateLog} アノテーションが付与されたメソッドをインターセプトし、監査ログを出力する.
   *
   * @param joinPoint 実行ポイント
   * @return メソッドの戻り値
   * @throws Throwable 例外
   */
  @Around("@annotation(DbRecordUpdateLog)")
  public Object auditUpdate(final ProceedingJoinPoint joinPoint) throws Throwable {
    final Object[] args = joinPoint.getArgs();
    if (args.length == 0 || !(args[0] instanceof DomainModel)) {
      return joinPoint.proceed();
    }

    final DomainModel model = (DomainModel) args[0];
    if (!model.hasChanges()) {
      logDbUpdateSkipped(model);
      return joinPoint.proceed();
    }

    final Object result = joinPoint.proceed();
    logDbUpdate(model);
    return result;
  }

  private void logDbUpdateSkipped(final DomainModel model) {
    final AppLogger appLogger = appLoggerProvider.getIfAvailable();
    if (appLogger == null) {
      return;
    }

    final String entityType = model.getClass().getSimpleName();
    final String id = getIdValue(model);
    appLogger.logDbUpdateSkipped(model.getClass(), entityType, id);
  }

  private String getIdValue(final DomainModel model) {
    try {
      final var method = model.getClass().getMethod("getId");
      final Object value = method.invoke(model);
      return value != null ? value.toString() : "[null]";
    } catch (final ReflectiveOperationException e) {
      return "[unknown]";
    }
  }

  private void logDbUpdate(final DomainModel model) {
    final AppLogger appLogger = appLoggerProvider.getIfAvailable();
    if (appLogger == null) {
      return;
    }

    final Set<String> changedFields = model.getChangedFields();
    final Map<String, String> originalValues = model.getOriginalValues();
    final String entityType = model.getClass().getSimpleName();
    final Map<String, Change> changes = new LinkedHashMap<>();

    for (final String field : changedFields) {
      final String oldValue = originalValues.getOrDefault(field, "[not tracked]");
      final String newValue = getNewValue(model, field);
      changes.put(field, new Change(mask(field, oldValue), mask(field, newValue)));
    }

    appLogger.logDbUpdate(model.getClass(), new DbUpdateLog(entityType, changes));
  }

  private String getNewValue(final DomainModel model, final String fieldName) {
    try {
      final var method = model.getClass().getMethod("get" + capitalize(fieldName));
      final Object value = method.invoke(model);
      return value != null ? value.toString() : "[null]";
    } catch (final ReflectiveOperationException e) {
      return "[unknown]";
    }
  }

  private String capitalize(final String str) {
    if (str == null || str.isEmpty()) {
      return str;
    }
    return Character.toUpperCase(str.charAt(0)) + str.substring(1);
  }

  private String mask(final String fieldName, final String value) {
    if (fieldName.equalsIgnoreCase("PASSWORD") || fieldName.equalsIgnoreCase("SECRET")) {
      return "***";
    }
    return value;
  }
}
