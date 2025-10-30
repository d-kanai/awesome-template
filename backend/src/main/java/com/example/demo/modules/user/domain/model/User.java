package com.example.demo.modules.user.domain.model;

import com.example.demo.modules.user.domain.value_object.UserEmail;
import com.example.demo.modules.user.domain.value_object.UserId;
import java.time.LocalDateTime;

public class User {
    private final UserId id;
    private final UserEmail email;
    private final String name;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private User(UserId id, UserEmail email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static User signup(String email, String name) {
        LocalDateTime now = LocalDateTime.now();
        return new User(UserId.generate(), UserEmail.of(email), name, now, now);
    }

    public static User reconstruct(UserId id, String email, String name, LocalDateTime createdAt, LocalDateTime updatedAt) {
        return new User(id, UserEmail.of(email), name, createdAt, updatedAt);
    }

    public User updateName(String newName) {
        return new User(this.id, this.email, newName, this.createdAt, LocalDateTime.now());
    }

    public User updateEmail(String newEmail) {
        return new User(this.id, UserEmail.of(newEmail), this.name, this.createdAt, LocalDateTime.now());
    }

    public UserId getId() { return id; }
    public String getEmail() { return email.getValue(); }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
