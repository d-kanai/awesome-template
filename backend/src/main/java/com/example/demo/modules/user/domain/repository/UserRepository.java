package com.example.demo.modules.user.domain.repository;

import com.example.demo.modules.user.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<User> findAll();
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    boolean existsById(UUID id);
    boolean existsByEmail(String email);
    User save(User user);
    void deleteById(UUID id);
}
