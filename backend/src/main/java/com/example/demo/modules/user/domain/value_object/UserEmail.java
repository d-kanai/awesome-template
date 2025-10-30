package com.example.demo.modules.user.domain.value_object;

import com.example.demo.modules.shared.domain.ValueObject;
import java.util.regex.Pattern;

public class UserEmail extends ValueObject<String> {
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final String value;

    private UserEmail(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid email format: " + value);
        }
        this.value = value;
    }

    public static UserEmail of(String value) {
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
