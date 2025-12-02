package com.example.demo.shared.infrastructure;

import com.example.demo.shared.domain.DomainModel;
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
}
