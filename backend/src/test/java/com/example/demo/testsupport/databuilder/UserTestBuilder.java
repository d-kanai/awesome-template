package com.example.demo.testsupport.databuilder;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserTestBuilder {
  private static UserRepository userRepository;

  private String email = "test@example.com";
  private String password = "Password123";

  private UserTestBuilder() {}

  @Autowired
  public void setUserRepository(final UserRepository userRepository) {
    UserTestBuilder.userRepository = userRepository;
  }

  public static UserTestBuilder aUser() {
    return new UserTestBuilder();
  }

  public UserTestBuilder email(final String email) {
    this.email = email;
    return this;
  }

  public UserTestBuilder password(final String password) {
    this.password = password;
    return this;
  }

  public User build() {
    return User.signup(email, password);
  }

  public User save() {
    final User user = build();
    userRepository.insert(user);
    return user;
  }
}
