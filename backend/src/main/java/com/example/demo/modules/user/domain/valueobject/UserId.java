package com.example.demo.modules.user.domain.valueobject;

import com.example.demo.modules.shared.domain.ValueObject;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.UUID;

public class UserId extends ValueObject<UUID> {
  private final UUID value;

  private UserId(final UUID value) {
    if (value == null) {
      throw new IllegalArgumentException("User id cannot be null");
    }
    this.value = value;
  }

  public static UserId generate() {
    return new UserId(UUID.randomUUID());
  }

  public static UserId reconstruct(final UUID value) {
    return new UserId(value);
  }

  public static UserId fromString(final String value) {
    if (value == null) {
      throw new IllegalArgumentException("User id cannot be null");
    }
    return new UserId(UUID.fromString(value));
  }

  @JsonValue
  public UUID getValue() {
    return value;
  }

  @Override
  protected UUID value() {
    return value;
  }
}
