package com.example.demo.modules.test.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.repository.UserRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TestDataSetupControllerIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private UserRepository userRepository;

  @Test
  void reset_removesAllDataFromTables() throws Exception {
    final String email = "john.doe+" + UUID.randomUUID() + "@example.com";
    userRepository.save(User.signup(email, "John Doe"));
    assertThat(userRepository.findAll()).isNotEmpty();

    mockMvc.perform(post("/test/reset")).andExpect(status().isNoContent());

    assertThat(userRepository.findAll()).isEmpty();
  }
}
