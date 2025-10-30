package com.example.demo.modules.user.presentation.controller;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.value_object.UserId;
import com.example.demo.modules.user.presentation.input.SignupInput;
import com.example.demo.testsupport.ApiTestClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApiTestClient apiTestClient;

    @BeforeEach
    void setUp() {
        userRepository.findAll()
            .forEach(user -> userRepository.deleteById(user.getId()));
    }

    @Test
    void signup_createsUserAndReturnsCreatedResponse() throws Exception {
        // given input
        SignupInput request = new SignupInput("john.doe@example.com", "John Doe");

        // given db
        assertThat(userRepository.findAll()).isEmpty();

        // when
        JsonNode responseBody = apiTestClient.post("/users", request)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNotEmpty())
            .andExpect(jsonPath("$.email").value(request.getEmail()))
            .andExpect(jsonPath("$.name").value(request.getName()))
            .andReturnBody();

        // then db
        UUID persistedId = UUID.fromString(responseBody.get("id").asText());

        assertThat(userRepository.findById(UserId.reconstruct(persistedId)))
            .isPresent()
            .get()
            .extracting(User::getEmail, User::getName)
            .containsExactly(request.getEmail(), request.getName());
    }

    @Test
    void findById_returnsUserDetails() throws Exception {
        // given db
        User existingUser = userRepository.save(User.signup("jane.doe@example.com", "Jane Doe"));

        // given input
        UUID userId = existingUser.getId().getValue();

        // when
        apiTestClient.get("/users/" + userId)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(existingUser.getId().getValue().toString()))
            .andExpect(jsonPath("$.email").value(existingUser.getEmail()))
            .andExpect(jsonPath("$.name").value(existingUser.getName()))
            .andExpect(jsonPath("$.createdAt").isNotEmpty())
            .andExpect(jsonPath("$.updatedAt").isNotEmpty());

        // then db
        User persistedUser = userRepository.findById(existingUser.getId()).orElseThrow();
        assertThat(persistedUser.getEmail()).isEqualTo(existingUser.getEmail());
        assertThat(persistedUser.getName()).isEqualTo(existingUser.getName());
    }
}
