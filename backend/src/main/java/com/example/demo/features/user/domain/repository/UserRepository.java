package com.example.demo.features.user.domain.repository;

import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.valueobject.UserId;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
  List<User> findAll();

  Optional<User> findById(final UserId id);

  Optional<User> findByEmail(final String email);

  boolean existsByEmail(final String email);

  User save(final User user);

  void deleteById(final UserId id);
}
