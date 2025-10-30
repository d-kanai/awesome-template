package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.domain.User;
import com.example.demo.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SignupCommand {
    private final UserRepository userRepository;

    public SignupCommand(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        return userRepository.save(user);
    }
}
