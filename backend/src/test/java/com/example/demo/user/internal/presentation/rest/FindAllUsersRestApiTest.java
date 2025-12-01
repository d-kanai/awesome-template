package com.example.demo.user.internal.presentation.rest;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.shared.jwt.JwtTokenProvider;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import com.example.demo.user.internal.domain.model.User;
import com.example.demo.user.internal.domain.repository.UserRepository;
import com.example.demo.user.internal.domain.valueobject.UserEmail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FindAllUsersRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private JwtTokenProvider jwtTokenProvider;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void ユーザー一覧取得時_認証済みで全ユーザーを返す() throws Exception {
    // given db
    final User user1 = User.signup("user1@example.com", "Password123");
    final User user2 = User.signup("user2@example.com", "Password456");
    userRepository.save(user1);
    userRepository.save(user2);

    // given token
    final String token =
        jwtTokenProvider.generateToken(user1.getId(), UserEmail.of(user1.getEmail()));

    // when
    final ApiTestResponse response = apiTestClient.getWithAuth("/users", token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray())
        .andExpect(jsonPath("$.users.length()").value(2))
        .andExpect(jsonPath("$.users[0].email").exists())
        .andExpect(jsonPath("$.users[1].email").exists());
  }

  @Test
  void ユーザー一覧取得時_ユーザーが0件の場合空配列を返す() throws Exception {
    // given db - empty

    // given token (create temporary user for auth, then delete)
    final User tempUser = User.signup("temp@example.com", "Password123");
    userRepository.save(tempUser);
    final String token =
        jwtTokenProvider.generateToken(tempUser.getId(), UserEmail.of(tempUser.getEmail()));
    userRepository.deleteById(tempUser.getId());

    // when
    final ApiTestResponse response = apiTestClient.getWithAuth("/users", token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray())
        .andExpect(jsonPath("$.users.length()").value(0));
  }

  @Test
  void ユーザー一覧取得時_未認証でUnauthorizedを返す() throws Exception {
    // when
    final ApiTestResponse response = apiTestClient.get("/users");

    // then response
    response.andExpect(status().isUnauthorized());
  }
}
