package com.example.demo.modules.user.presentation.controller;

import com.example.demo.modules.user.application.command.DeleteUserCommand;
import com.example.demo.modules.user.application.command.SignupCommand;
import com.example.demo.modules.user.application.command.UpdateUserCommand;
import com.example.demo.modules.user.application.query.FindAllUsersQuery;
import com.example.demo.modules.user.application.query.FindUserByEmailQuery;
import com.example.demo.modules.user.application.query.FindUserByIdQuery;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.presentation.input.SignupInput;
import com.example.demo.modules.user.presentation.input.UpdateUserInput;
import com.example.demo.modules.user.presentation.output.FindAllUsersOutput;
import com.example.demo.modules.user.presentation.output.FindUserByEmailOutput;
import com.example.demo.modules.user.presentation.output.FindUserByIdOutput;
import com.example.demo.modules.user.presentation.output.SignupOutput;
import com.example.demo.modules.user.presentation.output.UpdateUserOutput;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final SignupCommand signupCommand;
    private final UpdateUserCommand updateUserCommand;
    private final DeleteUserCommand deleteUserCommand;
    private final FindAllUsersQuery findAllUsersQuery;
    private final FindUserByIdQuery findUserByIdQuery;
    private final FindUserByEmailQuery findUserByEmailQuery;

    public UserController(SignupCommand signupCommand, UpdateUserCommand updateUserCommand,
                          DeleteUserCommand deleteUserCommand, FindAllUsersQuery findAllUsersQuery,
                          FindUserByIdQuery findUserByIdQuery, FindUserByEmailQuery findUserByEmailQuery) {
        this.signupCommand = signupCommand;
        this.updateUserCommand = updateUserCommand;
        this.deleteUserCommand = deleteUserCommand;
        this.findAllUsersQuery = findAllUsersQuery;
        this.findUserByIdQuery = findUserByIdQuery;
        this.findUserByEmailQuery = findUserByEmailQuery;
    }

    @GetMapping
    public ResponseEntity<FindAllUsersOutput> getAllUsers() {
        List<User> users = findAllUsersQuery.execute();
        return ResponseEntity.ok(FindAllUsersOutput.from(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FindUserByIdOutput> getUserById(@PathVariable Long id) {
        return findUserByIdQuery.execute(id)
            .map(FindUserByIdOutput::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<FindUserByEmailOutput> getUserByEmail(@PathVariable String email) {
        return findUserByEmailQuery.execute(email)
            .map(FindUserByEmailOutput::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SignupOutput> signup(@RequestBody SignupInput input) {
        try {
            User user = signupCommand.execute(input);
            return ResponseEntity.status(HttpStatus.CREATED).body(SignupOutput.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateUserOutput> updateUser(@PathVariable Long id, @RequestBody UpdateUserInput input) {
        try {
            User user = updateUserCommand.execute(id, input);
            return ResponseEntity.ok(UpdateUserOutput.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            deleteUserCommand.execute(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
