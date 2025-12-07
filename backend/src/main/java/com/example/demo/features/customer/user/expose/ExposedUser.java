package com.example.demo.features.customer.user.expose;

import java.time.LocalDateTime;
import java.util.UUID;

/** 他モジュールに公開するUser情報. */
public record ExposedUser(
    UUID id, String email, String password, LocalDateTime createdAt, LocalDateTime updatedAt) {}
