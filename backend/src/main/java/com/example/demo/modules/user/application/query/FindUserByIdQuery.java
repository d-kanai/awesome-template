package com.example.demo.modules.user.application.query;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.valueobject.UserId;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindUserByIdQuery {
  private final UserRepository userRepository;

  public FindUserByIdQuery(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Optional<User> execute(final UserId id) {
    return userRepository.findById(id);
  }
}
