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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ChangePasswordRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private CustomerJwtTokenProvider jwtTokenProvider;

  @Autowired private ApiTestClient apiTestClient;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void パスワードを変更できる() throws Exception {
    // given db
    final String oldPassword = "oldPassword123";
    final String newPassword = "newPassword456";
    final User user = aUser().email("user@example.com").password(oldPassword).save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), "user@example.com");

    // given input
    final var request = new ChangePasswordRestApi.Input(oldPassword, newPassword);

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changePassword", request, token);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value("user@example.com"));

    // then db
    final User updated = userRepository.findById(user.getId());
    assertThat(updated.getPassword()).isEqualTo(newPassword);
  }

  @Test
  void 未認証でUnauthorizedを返す() throws Exception {
    // given input
    final var request = new ChangePasswordRestApi.Input("oldPassword123", "newPassword456");

    // when
    final ApiTestResponse response = apiTestClient.put("/customer/users/changePassword", request);

    // then response
    response.andExpect(status().isUnauthorized());
  }

  @Test
  void 誤った現在パスワードでBadRequestを返す() throws Exception {
    // given db
    final User user = aUser().email("user@example.com").password("correctPassword123").save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), "user@example.com");

    // given input
    final var request = new ChangePasswordRestApi.Input("wrongPassword456", "newPassword789");

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changePassword", request, token);

    // then response
    response.andExpect(status().isBadRequest());

    // then db (unchanged)
    final User unchanged = userRepository.findById(user.getId());
    assertThat(unchanged.getPassword()).isEqualTo("correctPassword123");
  }

  @Test
  void 新パスワードが8文字未満でBadRequestを返す() throws Exception {
    // given db
    final String oldPassword = "oldPassword123";
    final User user = aUser().email("user@example.com").password(oldPassword).save();

    // given token
    final String token =
        jwtTokenProvider.generateToken(user.getId().getValue().toString(), "user@example.com");

    // given input
    final var request = new ChangePasswordRestApi.Input(oldPassword, "short");

    // when
    final ApiTestResponse response =
        apiTestClient.putWithAuth("/customer/users/changePassword", request, token);

    // then response
    response.andExpect(status().isBadRequest());

    // then db (unchanged)
    final User unchanged = userRepository.findById(user.getId());
    assertThat(unchanged.getPassword()).isEqualTo(oldPassword);
  }
}
