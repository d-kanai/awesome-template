package com.example.demo.features.customer.user.internal.presentation.job;

import static com.example.demo.testsupport.databuilder.UserTestBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThatCode;

import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
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
class UserStatsSummaryJobTest {

  @Autowired private UserRepository userRepository;

  @SuppressWarnings("unused")
  @Autowired
  private UserTestBuilder userTestBuilder;

  private UserStatsSummaryJob job;

  @BeforeEach
  void setUp() {
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
    job = new UserStatsSummaryJob(userRepository);
  }

  @Test
  void ユーザーが0件の場合正常に実行できる() {
    // given
    final var args = new UserStatsSummaryJob.Args(false, "2024-01-01");

    // when/then
    assertThatCode(() -> job.execute(args)).doesNotThrowAnyException();
  }

  @Test
  void ユーザーが存在する場合正常に実行できる() {
    // given
    aUser().email("user1@example.com").save();
    aUser().email("user2@example.com").save();
    aUser().email("user3@example.com").save();
    final var args = new UserStatsSummaryJob.Args(false, "2024-01-01");

    // when/then
    assertThatCode(() -> job.execute(args)).doesNotThrowAnyException();
  }

  @Test
  void dryRunモードで正常に実行できる() {
    // given
    aUser().email("user@example.com").save();
    final var args = new UserStatsSummaryJob.Args(true, "2024-01-01");

    // when/then
    assertThatCode(() -> job.execute(args)).doesNotThrowAnyException();
  }
}
