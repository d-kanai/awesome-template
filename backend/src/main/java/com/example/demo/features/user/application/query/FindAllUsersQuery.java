package com.example.demo.features.user.application.query;

import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FindAllUsersQuery {
  private final UserRepository userRepository;

  public FindAllUsersQuery(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Output execute() {
    return new Output(userRepository.findAll());
  }

  public record Output(List<User> users) {}
}
