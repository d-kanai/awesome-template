package com.example.demo.features.auth.internal.presentation.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.features.user.internal.domain.event.UserEventEnum;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.testsupport.ApiTestClient;
import com.example.demo.testsupport.ApiTestResponse;
import com.example.demo.testsupport.TestEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SignupRestApiTest {

  @Autowired private UserRepository userRepository;

  @Autowired private ApiTestClient apiTestClient;

  @Autowired private TestEventPublisher testEventPublisher;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
    testEventPublisher.clear();
  }

  @Test
  void ユーザーを作成しCreatedレスポンスを返す() throws Exception {
    // given input
    final var request = new SignupRestApi.Input("john.doe@example.com", "SecurePassword123");

    // given db
    assertThat(userRepository.findAll()).isEmpty();

    // when
    final ApiTestResponse response = apiTestClient.post("/auth/signup", request);

    // then response
    response
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").isNotEmpty())
        .andExpect(jsonPath("$.email").value(request.email()));

    // then db
    final User savedUser =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(() -> new AssertionError("User not found"));
    assertThat(savedUser)
        .extracting(User::getEmail, User::getPassword)
        .containsExactly(request.email(), request.password());

    // then event
    // SignupCommand publishes to both kafka and spring publishers (4 patterns sample)
    // In tests, both resolve to the same TestEventPublisher, so we get 2 identical events
    final var events = testEventPublisher.getDomainEventsOfType(UserSignedUpEvent.class);
    assertThat(events).hasSize(2);
    assertThat(events.getFirst())
        .satisfies(
            event -> {
              assertThat(event.userId()).isEqualTo(savedUser.getId().getValue());
              assertThat(event.email()).isEqualTo(request.email());
              assertThat(event.domainEventName()).isEqualTo(UserEventEnum.USER_SIGNED_UP);
            });
  }
}
