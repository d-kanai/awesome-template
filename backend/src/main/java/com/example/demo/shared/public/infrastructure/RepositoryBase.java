package com.example.demo.shared.infrastructure;

import com.example.demo.shared.domain.DomainModel;
import java.lang.reflect.Method;
import java.util.EnumMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiConsumer;
import org.jooq.DSLContext;
import org.jooq.UpdatableRecord;

/**
 * Repository基底クラス.
 *
 * <p>DSLContextとフィールドセッターのマッピングを提供する。
 *
 * @param <M> ドメインモデル型
 * @param <R> jOOQレコード型
 * @param <F> 更新可能フィールドのEnum型
 */
public abstract class RepositoryBase<
    M extends DomainModel<F>, R extends UpdatableRecord<R>, F extends Enum<F>> {

  protected final DSLContext dsl;
  private final Map<F, BiConsumer<M, R>> fieldSetters;

  protected RepositoryBase(final DSLContext dsl, final Map<F, BiConsumer<M, R>> fieldSetters) {
    this.dsl = dsl;
    this.fieldSetters = Map.copyOf(fieldSetters);
  }

  /** 変更されたフィールドの値をレコードに適用する. */
  protected void applyFieldSetters(final M model, final R record) {
    model.getChangedFields().stream()
        .filter(fieldSetters::containsKey)
        .forEach(field -> Objects.requireNonNull(fieldSetters.get(field)).accept(model, record));
  }

  /**
   * リフレクションを使用してフィールドセッターを自動生成する.
   *
   * <p>フィールド名の規約: EMAIL -> getEmail() / setEmail()
   *
   * @param enumClass フィールドEnumのClass
   * @param modelClass モデルのClass
   * @param recordClass レコードのClass
   * @return フィールドセッターのMap
   */
  protected static <M, R, F extends Enum<F>> Map<F, BiConsumer<M, R>> buildFieldSetters(
      final Class<F> enumClass, final Class<M> modelClass, final Class<R> recordClass) {
    final EnumMap<F, BiConsumer<M, R>> setters = new EnumMap<>(enumClass);
    for (final F field : enumClass.getEnumConstants()) {
      final String methodSuffix = toPascalCase(field.name());
      setters.put(field, createSetter(modelClass, recordClass, methodSuffix));
    }
    return setters;
  }

  private static <M, R> BiConsumer<M, R> createSetter(
      final Class<M> modelClass, final Class<R> recordClass, final String methodSuffix) {
    return (model, record) -> {
      try {
        final Method getter = modelClass.getMethod("get" + methodSuffix);
        final Object value = getter.invoke(model);
        final Method setter = findSetter(recordClass, "set" + methodSuffix);
        setter.invoke(record, value);
      } catch (final ReflectiveOperationException e) {
        throw new IllegalStateException("Failed to set field: " + methodSuffix, e);
      }
    };
  }

  private static Method findSetter(final Class<?> recordClass, final String setterName) {
    for (final Method method : recordClass.getMethods()) {
      if (method.getName().equals(setterName) && method.getParameterCount() == 1) {
        return method;
      }
    }
    throw new IllegalStateException("Setter not found: " + setterName);
  }

  private static String toPascalCase(final String enumName) {
    if (enumName == null || enumName.isEmpty()) {
      return enumName;
    }
    // EMAIL -> Email, FIRST_NAME -> FirstName
    final StringBuilder result = new StringBuilder();
    boolean capitalizeNext = true;
    for (final char c : enumName.toCharArray()) {
      if (c == '_') {
        capitalizeNext = true;
      } else if (capitalizeNext) {
        result.append(Character.toUpperCase(c));
        capitalizeNext = false;
      } else {
        result.append(Character.toLowerCase(c));
      }
    }
    return result.toString();
  }
}
