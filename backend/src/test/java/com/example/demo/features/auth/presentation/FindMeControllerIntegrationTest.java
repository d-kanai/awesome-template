package com.example.demo.features.auth.presentation;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.user.domain.model.User;
import com.example.demo.features.user.domain.repository.UserRepository;
import com.example.demo.features.user.domain.valueobject.UserEmail;
import com.example.demo.shared.jwt.JwtTokenProvider;
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
class FindMeControllerIntegrationTest {

  @Autowired private UserRepository userRepository;

  @Autowired private JwtTokenProvider jwtTokenProvider;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void 認証済みユーザー情報取得時_正しいトークンでユーザー情報を返す() throws Exception {
    // given db
    final String email = "john.doe@example.com";
    final String password = "SecurePassword123";
    final User user = User.signup(email, password);
    userRepository.save(user);

    // given token
    final String token = jwtTokenProvider.generateToken(user.getId(), UserEmail.of(email));

    // when
    final ApiTestResponse response = apiTestClient.getWithAuth("/auth/me", token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value(email));
  }

  @Test
  void 認証済みユーザー情報取得時_トークンなしでUnauthorizedを返す() throws Exception {
    // when
    final ApiTestResponse response = apiTestClient.get("/auth/me");

    // then response
    response.andExpect(status().isUnauthorized());
  }
}
