package com.example.demo.modules.user.domain;

import java.time.LocalDateTime;

public class User {
    private final Long id;
    private final String email;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public User(String email, String name) {
        this(null, email, name, null, null);
    }

    public User(Long id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public User updateName(String newName) {
        return new User(this.id, this.email, newName, this.createdAt, LocalDateTime.now());
    }

    public User updateEmail(String newEmail) {
        return new User(this.id, newEmail, this.name, this.createdAt, LocalDateTime.now());
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
