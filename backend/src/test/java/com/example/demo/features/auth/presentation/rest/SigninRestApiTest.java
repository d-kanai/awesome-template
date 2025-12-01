package com.example.demo.features.auth.presentation.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.repository.UserRepository;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SigninRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void サインイン時_正しい認証情報でOKレスポンスを返す() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String password = "SecurePassword123";

    // given db
    final User user = User.signup(email, password);
    userRepository.save(user);

    final var request = new SigninRestApi.Input(email, password);

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.accessToken").isNotEmpty());
  }

  @Test
  void サインイン時_誤ったパスワードでBadRequestを返す() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String correctPassword = "SecurePassword123";
    final String wrongPassword = "WrongPassword456";

    // given db
    final User user = User.signup(email, correctPassword);
    userRepository.save(user);

    final var request = new SigninRestApi.Input(email, wrongPassword);

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }

  @Test
  void サインイン時_存在しないメールアドレスでBadRequestを返す() throws Exception {
    // given input
    final var request = new SigninRestApi.Input("nonexistent@example.com", "SomePassword123");

    // given db
    assertThat(userRepository.findAll()).isEmpty();

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }
}
