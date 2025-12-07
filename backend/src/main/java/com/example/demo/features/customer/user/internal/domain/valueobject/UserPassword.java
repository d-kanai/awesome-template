package com.example.demo.features.customer.user.internal.domain.valueobject;

import com.example.demo.shared.domain.ValueObject;
import com.example.demo.shared.exception.DomainLayerException;

public class UserPassword extends ValueObject<String> {

  private static final int MIN_LENGTH = 8;

  private final String value;

  private UserPassword(final String value) {
    if (value == null || value.isBlank()) {
      throw new DomainLayerException("Password cannot be null or empty");
    }
    if (value.length() < MIN_LENGTH) {
      throw new DomainLayerException("Password must be at least " + MIN_LENGTH + " characters");
    }
    this.value = value;
  }

  public static UserPassword of(final String value) {
    return new UserPassword(value);
  }

  public String getValue() {
    return value;
  }

  @Override
  protected String value() {
    return value;
  }
}
