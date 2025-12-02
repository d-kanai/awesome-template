package com.example.demo.shared.audit;

import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.logging.RequestContext;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Repository.update() の監査ログを出力するAspect.
 *
 * <p>DomainModelのdirty tracking情報を使用して、変更されたフィールドのold/new値をログに出力する。
 */
@Aspect
@Component
public class RepositoryAuditAspect {

  private static final Logger log = LoggerFactory.getLogger(RepositoryAuditAspect.class);

  private final ObjectProvider<RequestContext> requestContextProvider;

  public RepositoryAuditAspect(final ObjectProvider<RequestContext> requestContextProvider) {
    this.requestContextProvider = requestContextProvider;
  }

  /**
   * Repository.update()メソッドをインターセプトし、監査ログを出力する.
   *
   * @param joinPoint 実行ポイント
   * @return メソッドの戻り値
   * @throws Throwable 例外
   */
  @Around("execution(* com.example.demo..repository.*Repository.update(..))")
  public Object auditUpdate(final ProceedingJoinPoint joinPoint) throws Throwable {
    final Object[] args = joinPoint.getArgs();
    if (args.length == 0 || !(args[0] instanceof DomainModel<?>)) {
      return joinPoint.proceed();
    }

    final DomainModel<?> model = (DomainModel<?>) args[0];
    if (!model.hasChanges()) {
      return joinPoint.proceed();
    }

    final Object result = joinPoint.proceed();
    logAudit(model);
    return result;
  }

  private void logAudit(final DomainModel<?> model) {
    final Set<?> changedFields = model.getChangedFields();
    final Map<?, String> originalValues = model.getOriginalValues();
    final String entityType = model.getClass().getSimpleName();

    final @Nullable RequestContext ctx = requestContextProvider.getIfAvailable();
    final String traceId = ctx != null ? ctx.getTraceId() : null;
    final String userId = ctx != null ? ctx.getUserId() : null;

    for (final var field : changedFields) {
      final String fieldName = field.toString();
      final String oldValue = originalValues.getOrDefault(field, "[not tracked]");
      final String newValue = getNewValue(model, fieldName);

      log.info(
          "AUDIT: traceId={}, userId={}, entity={}, field={}, old={}, new={}",
          traceId,
          userId,
          entityType,
          fieldName,
          mask(fieldName, oldValue),
          mask(fieldName, newValue));
    }
  }

  private String getNewValue(final DomainModel<?> model, final String fieldName) {
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
    return str.substring(0, 1).toUpperCase(Locale.ROOT) + str.substring(1).toLowerCase(Locale.ROOT);
  }

  private String mask(final String fieldName, final String value) {
    if (fieldName.equalsIgnoreCase("PASSWORD") || fieldName.equalsIgnoreCase("SECRET")) {
      return "***";
    }
    return value;
  }
}
