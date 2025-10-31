package com.example.demo.modules.user.application.query;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindUserByEmailQuery {
  private final UserRepository userRepository;

  public FindUserByEmailQuery(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Optional<User> execute(final String email) {
    return userRepository.findByEmail(email);
  }
}
