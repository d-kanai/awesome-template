package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class DeleteUserCommand {
    private final UserRepository userRepository;

    public DeleteUserCommand(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void execute(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
