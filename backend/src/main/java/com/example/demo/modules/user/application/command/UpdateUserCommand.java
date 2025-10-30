package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.domain.User;
import com.example.demo.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UpdateUserCommand {
    private final UserRepository userRepository;

    public UpdateUserCommand(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        User updatedUser = user.updateName(userDetails.getName());
        if (!user.getEmail().equals(userDetails.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + userDetails.getEmail());
            }
            updatedUser = updatedUser.updateEmail(userDetails.getEmail());
        }
        return userRepository.save(updatedUser);
    }
}
