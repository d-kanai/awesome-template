package com.example.demo.features.customer.user.internal.presentation.rest;

import static com.example.demo.testsupport.databuilder.UserTestBuilder.aUser;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.customer.user.internal.domain.model.User;
import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.security.customer.CustomerJwtTokenProvider;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import com.example.demo.testsupport.databuilder.UserTestBuilder;
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

  @Autowired private CustomerJwtTokenProvider jwtTokenProvider;

  @Autowired private ApiTestClient apiTestClient;

  @Autowired private UserTestBuilder userTestBuilder;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void 認証済みで全ユーザーを返す() throws Exception {
    // given db
    final User user1 = aUser().email("user1@example.com").save();
    aUser().email("user2@example.com").save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user1.getId().getValue().toString(), user1.getEmail());

    // when
    final ApiTestResponse response = apiTestClient.getWithAuth("/customer/users", token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray())
        .andExpect(jsonPath("$.users.length()").value(2))
        .andExpect(jsonPath("$.users[0].email").exists())
        .andExpect(jsonPath("$.users[1].email").exists());
  }

  @Test
  void ユーザーが0件の場合空配列を返す() throws Exception {
    // given db - empty

    // given token (create temporary user for auth, then delete)
    final User tempUser = aUser().save();
    final String token =
        jwtTokenProvider.generateToken(tempUser.getId().getValue().toString(), tempUser.getEmail());
    userRepository.deleteById(tempUser.getId());

    // when
    final ApiTestResponse response = apiTestClient.getWithAuth("/customer/users", token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray())
        .andExpect(jsonPath("$.users.length()").value(0));
  }

  @Test
  void 未認証でUnauthorizedを返す() throws Exception {
    // when
    final ApiTestResponse response = apiTestClient.get("/customer/users");

    // then response
    response.andExpect(status().isUnauthorized());
  }
}
