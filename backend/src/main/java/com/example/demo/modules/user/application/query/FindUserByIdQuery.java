package com.example.demo.modules.user.application.query;

import com.example.demo.modules.user.domain.User;
import com.example.demo.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class FindUserByIdQuery {
    private final UserRepository userRepository;

    public FindUserByIdQuery(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> execute(Long id) {
        return userRepository.findById(id);
    }
}
