package com.example.demo.features.user.internal.domain.model;

import com.example.demo.features.user.internal.domain.valueobject.UserEmail;
import com.example.demo.features.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.time.AppClock;
import java.time.LocalDateTime;
import java.util.Set;

public class User extends DomainModel<User.Field> {

  public enum Field {
    EMAIL,
    PASSWORD
  }

  private final UserId id;
  private final UserEmail email;
  private final String password;
  private final LocalDateTime createdAt;
  private final LocalDateTime updatedAt;

  private User(
      final UserId id,
      final UserEmail email,
      final String password,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt,
      final Set<Field> changedFields) {
    super(changedFields);
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static User signup(final String email, final String password) {
    final LocalDateTime now = AppClock.nowLocalDateTime();
    return new User(UserId.generate(), UserEmail.of(email), password, now, now, Set.of());
  }

  public static User reconstruct(
      final UserId id,
      final String email,
      final String password,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    return new User(id, UserEmail.of(email), password, createdAt, updatedAt, Set.of());
  }

  public User changeEmail(final String newEmail) {
    return new User(
        this.id,
        UserEmail.of(newEmail),
        this.password,
        this.createdAt,
        AppClock.nowLocalDateTime(),
        addChangedField(Field.EMAIL));
  }

  public UserId getId() {
    return id;
  }

  public String getEmail() {
    return email.getValue();
  }

  public String getPassword() {
    return password;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}
