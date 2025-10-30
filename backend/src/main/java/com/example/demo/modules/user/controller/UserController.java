package com.example.demo.modules.user.controller;

import com.example.demo.modules.user.application.command.*;
import com.example.demo.modules.user.application.query.*;
import com.example.demo.modules.user.domain.model.User;
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
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(findAllUsersQuery.execute());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return findUserByIdQuery.execute(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return findUserByEmailQuery.execute(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(signupCommand.execute(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            return ResponseEntity.ok(updateUserCommand.execute(id, user));
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
