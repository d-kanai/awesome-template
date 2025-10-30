package com.example.demo.modules.user.presentation.output;

import com.example.demo.modules.user.domain.model.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class FindUserByIdOutput {
    private final UUID id;
    private final String email;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public FindUserByIdOutput(UUID id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static FindUserByIdOutput from(User user) {
        return new FindUserByIdOutput(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
