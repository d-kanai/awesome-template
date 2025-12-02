package com.example.demo.shared.domain;

import com.example.demo.shared.event.DomainEvent;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.jspecify.annotations.Nullable;

/**
 * ドメインモデルの基底クラス.
 *
 * <p>Snapshot Patternによる変更追跡とドメインイベント登録機能を提供する。
 * reconstruct時にスナップショットを保存し、update時に現在値と比較してdiffを抽出する。
 */
public abstract class DomainModel {

  @Nullable private Map<String, String> snapshot;
  private final List<DomainEvent> domainEvents = new ArrayList<>();

  protected DomainModel() {
    this.snapshot = null;
  }

  /** スナップショットを保存する（reconstruct時に呼び出す）. */
  protected void captureSnapshot() {
    this.snapshot = captureCurrentState();
  }

  /** 変更があるかどうか. */
  public boolean hasChanges() {
    return !getChangedFields().isEmpty();
  }

  /** 変更されたフィールド名のSetを返す. */
  public Set<String> getChangedFields() {
    if (snapshot == null) {
      return Set.of();
    }
    final Map<String, String> current = captureCurrentState();
    final Set<String> changed = new java.util.LinkedHashSet<>();
    for (final var entry : current.entrySet()) {
      final String field = entry.getKey();
      final String currentValue = entry.getValue();
      final String originalValue = snapshot.get(field);
      if (!Objects.equals(originalValue, currentValue)) {
        changed.add(field);
      }
    }
    return changed;
  }

  /** 変更前の値を返す（監査ログ用）. */
  public Map<String, String> getOriginalValues() {
    if (snapshot == null) {
      return Map.of();
    }
    final Map<String, String> originals = new LinkedHashMap<>();
    for (final String field : getChangedFields()) {
      final String originalValue = snapshot.get(field);
      if (originalValue != null) {
        originals.put(field, originalValue);
      }
    }
    return originals;
  }

  /** ドメインイベントを登録する. */
  protected void registerEvent(final DomainEvent event) {
    domainEvents.add(event);
  }

  /** 登録されたドメインイベントを取得する. */
  public List<DomainEvent> getDomainEvents() {
    return List.copyOf(domainEvents);
  }

  /** ドメインイベントをクリアする. */
  public void clearDomainEvents() {
    domainEvents.clear();
  }

  private Map<String, String> captureCurrentState() {
    final Map<String, String> state = new LinkedHashMap<>();
    for (final Method method : getClass().getMethods()) {
      if (isGetter(method)) {
        final String fieldName = extractFieldName(method.getName());
        final String value = invokeGetter(method);
        state.put(fieldName, value);
      }
    }
    return state;
  }

  private boolean isGetter(final Method method) {
    final String name = method.getName();
    return name.startsWith("get")
        && !name.equals("getClass")
        && !name.equals("getChangedFields")
        && !name.equals("getOriginalValues")
        && !name.equals("getDomainEvents")
        && method.getParameterCount() == 0
        && method.getDeclaringClass() != Object.class
        && method.getDeclaringClass() != DomainModel.class;
  }

  private String extractFieldName(final String getterName) {
    // getEmail -> email, getUpdatedAt -> updatedAt
    final String name = getterName.substring(3);
    return Character.toLowerCase(name.charAt(0)) + name.substring(1);
  }

  @Nullable
  private String invokeGetter(final Method getter) {
    try {
      final Object value = getter.invoke(this);
      return value != null ? value.toString() : null;
    } catch (final ReflectiveOperationException e) {
      return null;
    }
  }
}
