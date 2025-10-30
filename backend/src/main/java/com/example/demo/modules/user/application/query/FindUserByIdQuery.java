package com.example.demo.modules.user.application.query;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class FindUserByIdQuery {
    private final UserRepository userRepository;

    public FindUserByIdQuery(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> execute(UUID id) {
        return userRepository.findById(id);
    }
}
