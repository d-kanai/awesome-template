package com.example.demo.features.test.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.repository.UserRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SupportE2ETestControllerIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private UserRepository userRepository;

  @Test
  void リセット時_全テーブルからデータを削除する() throws Exception {
    final String email = "john.doe+" + UUID.randomUUID() + "@example.com";
    userRepository.save(User.signup(email, "John Doe"));
    assertThat(userRepository.findAll()).isNotEmpty();

    mockMvc.perform(post("/e2e/reset_data")).andExpect(status().isNoContent());

    assertThat(userRepository.findAll()).isEmpty();
  }
}
