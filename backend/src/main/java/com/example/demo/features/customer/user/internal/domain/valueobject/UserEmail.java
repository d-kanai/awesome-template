package com.example.demo.features.customer.user.internal.domain.valueobject;

import com.example.demo.shared.domain.ValueObject;
import com.example.demo.shared.exception.DomainLayerException;
import java.util.regex.Pattern;

public class UserEmail extends ValueObject<String> {
  private static final Pattern EMAIL_PATTERN =
      Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

  private final String value;

  private UserEmail(final String value) {
    if (value == null || value.isBlank()) {
      throw new DomainLayerException("Email cannot be null or empty");
    }
    if (!EMAIL_PATTERN.matcher(value).matches()) {
      throw new DomainLayerException("Invalid email format: " + value);
    }
    this.value = value;
  }

  public static UserEmail of(final String value) {
    return new UserEmail(value);
  }

  public String getValue() {
    return value;
  }

  @Override
  protected String value() {
    return value;
  }
}
