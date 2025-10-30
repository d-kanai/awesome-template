package com.example.demo.modules.user.domain.value_object;

import com.example.demo.modules.shared.domain.ValueObject;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "ユーザーの一意な識別子", type = "string", format = "uuid", example = "2b6a4f95-4ddc-4af1-9f79-a6b3a9e3e1d4")
public class UserId extends ValueObject<UUID> {
    private final UUID value;

    private UserId(UUID value) {
        if (value == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }
        this.value = value;
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID());
    }

    public static UserId reconstruct(UUID value) {
        return new UserId(value);
    }

    public static UserId fromString(String value) {
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
