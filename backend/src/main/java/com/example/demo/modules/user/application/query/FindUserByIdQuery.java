package com.example.demo.modules.user.application.query;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.value_object.UserId;
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

    public Optional<User> execute(UserId id) {
        return userRepository.findById(id);
    }
}
