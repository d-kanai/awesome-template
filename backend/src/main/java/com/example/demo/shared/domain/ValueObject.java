package com.example.demo.shared.domain;

import java.io.Serializable;

public abstract class ValueObject<T> implements Serializable {

  protected abstract T value();

  @Override
  public boolean equals(final Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof ValueObject<?> that)) {
      return false;
    }
    return value().equals(that.value());
  }

  @Override
  public int hashCode() {
    return value().hashCode();
  }

  @Override
  public String toString() {
    return value().toString();
  }
}
