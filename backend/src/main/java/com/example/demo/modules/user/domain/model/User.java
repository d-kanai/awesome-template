package com.example.demo.modules.user.domain.model;

import com.example.demo.modules.user.domain.valueobject.UserEmail;
import com.example.demo.modules.user.domain.valueobject.UserId;
import java.time.LocalDateTime;

public class User {
  private final UserId id;
  private final UserEmail email;
  private final String name;
  private final LocalDateTime createdAt;
  private final LocalDateTime updatedAt;

  private User(
      final UserId id,
      final UserEmail email,
      final String name,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static User signup(final String email, final String name) {
    final LocalDateTime now = LocalDateTime.now();
    return new User(UserId.generate(), UserEmail.of(email), name, now, now);
  }

  public static User reconstruct(
      final UserId id,
      final String email,
      final String name,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    return new User(id, UserEmail.of(email), name, createdAt, updatedAt);
  }

  public User updateProfile(final String newEmail, final String newName) {
    return new User(this.id, UserEmail.of(newEmail), newName, this.createdAt, LocalDateTime.now());
  }

  public UserId getId() {
    return id;
  }

  public String getEmail() {
    return email.getValue();
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
