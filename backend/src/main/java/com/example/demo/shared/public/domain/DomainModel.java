package com.example.demo.shared.domain;

import java.util.EnumSet;
import java.util.Set;
import org.jspecify.annotations.Nullable;

/**
 * ドメインモデルの基底クラス.
 *
 * <p>変更追跡（dirty tracking）機能を提供する。 リポジトリのupdateメソッドで変更されたフィールドのみをUPDATEできる。
 *
 * @param <T> フィールドを表すEnum型
 */
public abstract class DomainModel<T extends Enum<T>> {

  @Nullable private EnumSet<T> changedFields;

  protected DomainModel() {
    this.changedFields = null;
  }

  /** フィールドを変更済みとしてマークする. */
  @SuppressWarnings("unchecked")
  protected void markChanged(final T field) {
    if (changedFields == null) {
      changedFields = EnumSet.of(field);
    } else {
      changedFields.add(field);
    }
  }

  /** 変更があるかどうか. */
  public boolean hasChanges() {
    return changedFields != null && !changedFields.isEmpty();
  }

  /** 指定フィールドが変更されているか. */
  public boolean isChanged(final T field) {
    return changedFields != null && changedFields.contains(field);
  }

  /** 変更されたフィールドのSetを返す. */
  public Set<T> getChangedFields() {
    return changedFields != null ? changedFields : Set.of();
  }
}
