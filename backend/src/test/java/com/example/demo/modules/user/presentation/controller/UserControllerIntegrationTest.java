package com.example.demo.modules.user.presentation.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

  @Autowired private UserRepository userRepository;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void findById_returnsUserDetails() throws Exception {
    // given db
    final User existingUser =
        userRepository.save(User.signup("jane.doe@example.com", "SecurePassword123"));

    // given input
    final UUID userId = existingUser.getId().getValue();

    // when
    final ApiTestResponse response = apiTestClient.get("/users/" + userId);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(existingUser.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value(existingUser.getEmail()))
        .andExpect(jsonPath("$.createdAt").isNotEmpty())
        .andExpect(jsonPath("$.updatedAt").isNotEmpty());
  }
}
