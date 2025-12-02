package com.example.demo.features.notification.internal.presentation.consumer;

import static com.example.demo.shared.jooq.tables.NotificationHistories.NOTIFICATION_HISTORIES;
import static com.example.demo.testsupport.databuilder.UserTestBuilder.aUser;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.demo.features.notification.internal.application.command.SendWelcomeEmailCommand;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.testsupport.databuilder.UserTestBuilder;
import java.util.UUID;
import org.jooq.DSLContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserSignedUpNotificationConsumerTest {

  @Autowired private SendWelcomeEmailCommand sendWelcomeEmailCommand;

  @Autowired private UserRepository userRepository;

  @SuppressWarnings("unused")
  @Autowired
  private UserTestBuilder userTestBuilder;

  @Autowired private DSLContext dsl;

  private UserSignedUpNotificationConsumer consumer;

  @BeforeEach
  void setUp() {
    dsl.deleteFrom(NOTIFICATION_HISTORIES).execute();
    userRepository.findAll().forEach(user -> userRepository.deleteById(user.getId()));
    consumer = new UserSignedUpNotificationConsumer(sendWelcomeEmailCommand);
  }

  @Test
  void 初回イベント受信でウェルカムメールを送信して履歴を記録する() {
    // given
    final var user = aUser().save();
    final UUID userId = user.getId().getValue();
    final String email = user.getEmail();
    final var event = UserSignedUpEvent.of(userId, email);

    // when
    consumer.consume(event);

    // then
    assertThat(existsHistory(userId, "welcome_email_sent")).isTrue();
  }

  @Test
  void 重複イベント受信で履歴記録をスキップする() {
    // given
    final var user = aUser().save();
    final UUID userId = user.getId().getValue();
    final String email = user.getEmail();
    final var event = UserSignedUpEvent.of(userId, email);

    // 初回受信
    consumer.consume(event);
    assertThat(existsHistory(userId, "welcome_email_sent")).isTrue();

    // when - 重複受信
    consumer.consume(event);

    // then - 履歴は1件のまま（重複INSERTされない）
    final int count =
        dsl.fetchCount(
            dsl.selectFrom(NOTIFICATION_HISTORIES)
                .where(NOTIFICATION_HISTORIES.USER_ID.eq(userId))
                .and(NOTIFICATION_HISTORIES.EVENT_TYPE.eq("welcome_email_sent")));
    assertThat(count).isEqualTo(1);
  }

  private boolean existsHistory(final UUID userId, final String eventType) {
    return dsl.fetchExists(
        dsl.selectFrom(NOTIFICATION_HISTORIES)
            .where(NOTIFICATION_HISTORIES.USER_ID.eq(userId))
            .and(NOTIFICATION_HISTORIES.EVENT_TYPE.eq(eventType)));
  }
}
