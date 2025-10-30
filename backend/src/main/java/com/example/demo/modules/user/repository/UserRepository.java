package com.example.demo.modules.user.repository;

import com.example.demo.modules.user.domain.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsById(Long id);
    boolean existsByEmail(String email);
    User save(User user);
    void deleteById(Long id);
}
