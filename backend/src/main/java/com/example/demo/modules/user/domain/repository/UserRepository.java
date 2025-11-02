package com.example.demo.modules.user.domain.repository;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.valueobject.UserId;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
  List<User> findAll();

  Optional<User> findByEmail(final String email);

  boolean existsByEmail(final String email);

  User save(final User user);

  void deleteById(final UserId id);
}
