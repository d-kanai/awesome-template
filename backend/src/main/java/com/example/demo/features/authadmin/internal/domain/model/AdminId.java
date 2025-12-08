package com.example.demo.features.authadmin.internal.domain.model;

import java.util.UUID;

public record AdminId(UUID value) {

  public static AdminId of(final UUID value) {
    return new AdminId(value);
  }

  public static AdminId generate() {
    return new AdminId(UUID.randomUUID());
  }
}
