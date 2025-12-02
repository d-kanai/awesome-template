package com.example.demo.features.user.internal.domain.model;

import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import com.example.demo.features.user.internal.domain.valueobject.UserEmail;
import com.example.demo.features.user.internal.domain.valueobject.UserId;
import com.example.demo.shared.domain.DomainModel;
import com.example.demo.shared.time.AppClock;
import java.time.LocalDateTime;

public class User extends DomainModel<User.Field> {

  public enum Field {
    EMAIL,
    PASSWORD
  }

  private final UserId id;
  private UserEmail email;
  private String password;
  private final LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  private User(
      final UserId id,
      final UserEmail email,
      final String password,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static User signup(final String email, final String password) {
    final LocalDateTime now = AppClock.nowLocalDateTime();
    final User user = new User(UserId.generate(), UserEmail.of(email), password, now, now);
    user.registerEvent(UserSignedUpEvent.of(user.getId().getValue(), email));
    return user;
  }

  public static User reconstruct(
      final UserId id,
      final String email,
      final String password,
      final LocalDateTime createdAt,
      final LocalDateTime updatedAt) {
    return new User(id, UserEmail.of(email), password, createdAt, updatedAt);
  }

  public void changeEmail(final String newEmail) {
    final String oldEmail = this.email.getValue();
    this.email = UserEmail.of(newEmail);
    this.updatedAt = AppClock.nowLocalDateTime();
    markChanged(Field.EMAIL, oldEmail);
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
