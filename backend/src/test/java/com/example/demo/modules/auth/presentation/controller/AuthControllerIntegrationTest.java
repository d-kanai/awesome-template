package com.example.demo.modules.auth.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.modules.auth.presentation.input.SignupInput;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.modules.user.domain.valueobject.UserId;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

  @Autowired private UserRepository userRepository;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void signup_createsUserAndReturnsCreatedResponse() throws Exception {
    // given input
    final SignupInput request = new SignupInput("john.doe@example.com", "John Doe");

    // given db
    assertThat(userRepository.findAll()).isEmpty();

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signup", request);

    // then response
    final JsonNode responseBody =
        response
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNotEmpty())
            .andExpect(jsonPath("$.email").value(request.getEmail()))
            .andExpect(jsonPath("$.name").value(request.getName()))
            .andReturnBody();

    // then db
    final UUID persistedId = UUID.fromString(responseBody.get("id").asText());
    assertThat(userRepository.findById(UserId.reconstruct(persistedId)))
        .isPresent()
        .get()
        .extracting(User::getEmail, User::getName)
        .containsExactly(request.getEmail(), request.getName());
  }
}
