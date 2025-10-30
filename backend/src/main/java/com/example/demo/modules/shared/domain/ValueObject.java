package com.example.demo.modules.shared.domain;

import java.io.Serializable;

public abstract class ValueObject<T> implements Serializable {

    protected abstract T value();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ValueObject<?> that = (ValueObject<?>) o;
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
