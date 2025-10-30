package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.presentation.input.UpdateUserInput;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class UpdateUserCommand {
    private final UserRepository userRepository;

    public UpdateUserCommand(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(UUID id, UpdateUserInput input) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        User updatedUser = user.updateName(input.getName());
        if (!user.getEmail().equals(input.getEmail())) {
            if (userRepository.existsByEmail(input.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + input.getEmail());
            }
            updatedUser = updatedUser.updateEmail(input.getEmail());
        }
        return userRepository.save(updatedUser);
    }
}
