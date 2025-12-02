package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.notification.internal.application.command.SendWelcomeEmailCommand;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserSignedUpNotificationConsumerTest {

  private UserSignedUpNotificationConsumer consumer;

  @BeforeEach
  void setUp() {
    consumer = new UserSignedUpNotificationConsumer(new SendWelcomeEmailCommand());
  }

  @Test
  void UserSignedUpEventを受信してSendWelcomeEmailCommandを実行する() {
    // given
    final UUID userId = UUID.randomUUID();
    final String email = "test@example.com";
    final UserSignedUpEvent event = UserSignedUpEvent.of(userId, email);

    // when
    consumer.consume(event);

    // then
    // TODO: assert that SendWelcomeEmailCommand was executed with correct input
  }
}
