package com.example.demo.modules.auth.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.modules.auth.presentation.input.SigninInput;
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
    final SignupInput request = new SignupInput("john.doe@example.com", "SecurePassword123");

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
            .andReturnBody();

    // then db
    final UUID persistedId = UUID.fromString(responseBody.get("id").asText());
    assertThat(userRepository.findById(UserId.reconstruct(persistedId)))
        .isPresent()
        .get()
        .extracting(User::getEmail, User::getPassword)
        .containsExactly(request.getEmail(), request.getPassword());
  }

  @Test
  void signin_withCorrectCredentials_returnsOkResponse() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String password = "SecurePassword123";

    // given db
    final User user = User.signup(email, password);
    userRepository.save(user);

    final SigninInput request = new SigninInput(email, password);

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value(email));
  }

  @Test
  void signin_withIncorrectPassword_returnsBadRequest() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String correctPassword = "SecurePassword123";
    final String wrongPassword = "WrongPassword456";

    // given db
    final User user = User.signup(email, correctPassword);
    userRepository.save(user);

    final SigninInput request = new SigninInput(email, wrongPassword);

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }

  @Test
  void signin_withNonExistentEmail_returnsBadRequest() throws Exception {
    // given input
    final SigninInput request = new SigninInput("nonexistent@example.com", "SomePassword123");

    // given db
    assertThat(userRepository.findAll()).isEmpty();

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }
}
