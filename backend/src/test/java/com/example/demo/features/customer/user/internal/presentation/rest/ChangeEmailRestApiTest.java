package com.example.demo.features.customer.user.internal.presentation.rest;

import static com.example.demo.testsupport.databuilder.UserTestBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
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
class ChangeEmailRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private CustomerJwtTokenProvider jwtTokenProvider;

  @Autowired private ApiTestClient apiTestClient;

  @Autowired private UserTestBuilder userTestBuilder;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void メールアドレスを変更できる() throws Exception {
    // given db
    final User user = aUser().email("old@example.com").save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), "old@example.com");

    // given input
    final var request = new ChangeEmailRestApi.Input("new@example.com");

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changeEmail", request, token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value("new@example.com"));

    // then db
    final User updated = userRepository.findById(user.getId());
    assertThat(updated.getEmail()).isEqualTo("new@example.com");
  }

  @Test
  void 未認証でUnauthorizedを返す() throws Exception {
    // given input
    final var request = new ChangeEmailRestApi.Input("new@example.com");

    // when
    final ApiTestResponse response = apiTestClient.put("/customer/users/changeEmail", request);

    // then response
    response.andExpect(status().isUnauthorized());
  }

  @Test
  void 重複メールアドレスでBadRequestを返す() throws Exception {
    // given db
    final User user1 = aUser().email("user1@example.com").save();
    aUser().email("existing@example.com").save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user1.getId().getValue().toString(), "user1@example.com");

    // given input
    final var request = new ChangeEmailRestApi.Input("existing@example.com");

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changeEmail", request, token);

    // then response
    response.andExpect(status().isBadRequest());

    // then db (unchanged)
    final User unchanged = userRepository.findById(user1.getId());
    assertThat(unchanged.getEmail()).isEqualTo("user1@example.com");
  }

  @Test
  void 不正なメール形式でBadRequestを返す() throws Exception {
    // given db
    final User user = aUser().email("user@example.com").save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), "user@example.com");

    // given input
    final var request = new ChangeEmailRestApi.Input("invalid-email");

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changeEmail", request, token);

    // then response
    response.andExpect(status().isBadRequest());
  }
}
