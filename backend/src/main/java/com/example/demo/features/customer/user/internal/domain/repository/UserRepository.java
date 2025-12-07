package com.example.demo.features.customer.user.internal.domain.repository;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.valueobject.UserId;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
  long count();

  List<User> findAll();

  User findById(final UserId id);

  Optional<User> findByEmail(final String email);

  boolean existsByEmail(final String email);

  void insert(final User user);

  void update(final User user);

  void deleteById(final UserId id);
}
