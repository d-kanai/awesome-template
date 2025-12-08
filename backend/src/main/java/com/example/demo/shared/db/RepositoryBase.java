package com.example.demo.shared.db;

import com.example.demo.shared.domain.DomainModel;
import java.lang.reflect.Method;
import org.jooq.DSLContext;
import org.jooq.UpdatableRecord;

/**
 * Repository基底クラス.
 *
 * <p>DSLContextとフィールドセッターのマッピングを提供する。
 *
 * @param <M> ドメインモデル型
 * @param <R> jOOQレコード型
 */
public abstract class RepositoryBase<M extends DomainModel, R extends UpdatableRecord<R>> {

  protected final DSLContext dsl;

  protected RepositoryBase(final DSLContext dsl) {
    this.dsl = dsl;
  }

  /** 変更されたフィールドの値をレコードに適用する. */
  protected void setUpdateFields(final M model, final R record) {
    for (final String fieldName : model.getChangedFields()) {
      setField(model, record, fieldName);
    }
  }

  private void setField(final M model, final R record, final String fieldName) {
    try {
      final String methodSuffix = capitalize(fieldName);
      final Method getter = model.getClass().getMethod("get" + methodSuffix);
      final Object value = getter.invoke(model);
      final Method setter = findSetter(record.getClass(), "set" + methodSuffix);
      setter.invoke(record, value);
    } catch (final ReflectiveOperationException e) {
      throw new IllegalStateException("Failed to set field: " + fieldName, e);
    }
  }

  private Method findSetter(final Class<?> recordClass, final String setterName) {
    for (final Method method : recordClass.getMethods()) {
      if (method.getName().equals(setterName) && method.getParameterCount() == 1) {
        return method;
      }
    }
    throw new IllegalStateException("Setter not found: " + setterName);
  }

  private static String capitalize(final String name) {
    if (name == null || name.isEmpty()) {
      return name;
    }
    return Character.toUpperCase(name.charAt(0)) + name.substring(1);
  }
}
