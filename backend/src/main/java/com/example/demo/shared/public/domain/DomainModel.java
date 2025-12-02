package com.example.demo.shared.domain;

import java.util.EnumSet;
import java.util.Set;

/**
 * ドメインモデルの基底クラス.
 *
 * <p>変更追跡（dirty tracking）機能を提供する。 リポジトリのupdateメソッドで変更されたフィールドのみをUPDATEできる。
 *
 * @param <T> フィールドを表すEnum型
 */
public abstract class DomainModel<T extends Enum<T>> {

  private final Set<T> changedFields;

  protected DomainModel() {
    this.changedFields = Set.of();
  }

  protected DomainModel(final Set<T> changedFields) {
    this.changedFields = changedFields.isEmpty() ? Set.of() : EnumSet.copyOf(changedFields);
  }

  /** 変更フィールドを追加した新しいSetを返す. */
  protected Set<T> addChangedField(final T field) {
    final EnumSet<T> newChangedFields =
        changedFields.isEmpty() ? EnumSet.of(field) : EnumSet.copyOf(this.changedFields);
    newChangedFields.add(field);
    return newChangedFields;
  }

  /** 変更があるかどうか. */
  public boolean hasChanges() {
    return !changedFields.isEmpty();
  }

  /** 指定フィールドが変更されているか. */
  public boolean isChanged(final T field) {
    return changedFields.contains(field);
  }

  /** 変更されたフィールドのSetを返す. */
  public Set<T> getChangedFields() {
    return changedFields;
  }
}
