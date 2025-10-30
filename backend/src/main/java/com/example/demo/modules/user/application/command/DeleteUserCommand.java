package com.example.demo.modules.user.application.command;

import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.value_object.UserId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DeleteUserCommand {
    private final UserRepository userRepository;

    public DeleteUserCommand(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void execute(final UserId id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
