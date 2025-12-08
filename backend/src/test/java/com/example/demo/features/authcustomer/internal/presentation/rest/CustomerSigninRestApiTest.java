package com.example.demo.features.authcustomer.internal.presentation.rest;

import static com.example.demo.testsupport.databuilder.UserTestBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
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
class CustomerSigninRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private ApiTestClient apiTestClient;

  @Autowired private UserTestBuilder userTestBuilder;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
  }

  @Test
  void 正しい認証情報でOKレスポンスを返す() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String password = "SecurePassword123";
    final var request = new CustomerSigninRestApi.Input(email, password);

    // given db
    final User user = aUser().email(email).password(password).save();

    // when
    final ApiTestResponse response = apiTestClient.post("/customer/auth/signin", request);

    // then response
    response
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(user.getId().getValue().toString()))
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.accessToken").isNotEmpty());
  }

  @Test
  void 誤ったパスワードでBadRequestを返す() throws Exception {
    // given input
    final String email = "john.doe@example.com";
    final String correctPassword = "SecurePassword123";
    final String wrongPassword = "WrongPassword456";
    final var request = new CustomerSigninRestApi.Input(email, wrongPassword);

    // given db
    aUser().email(email).password(correctPassword).save();

    // when
    final ApiTestResponse response = apiTestClient.post("/customer/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }

  @Test
  void 存在しないメールアドレスでBadRequestを返す() throws Exception {
    // given input
    final var request =
        new CustomerSigninRestApi.Input("nonexistent@example.com", "SomePassword123");

    // given db
    assertThat(userRepository.findAll()).isEmpty();

    // when
    final ApiTestResponse response = apiTestClient.post("/customer/auth/signin", request);

    // then response
    response.andExpect(status().isBadRequest());
  }
}
