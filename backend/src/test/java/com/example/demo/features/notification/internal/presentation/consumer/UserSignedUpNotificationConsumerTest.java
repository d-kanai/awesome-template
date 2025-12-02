package com.example.demo.features.notification.internal.presentation.consumer;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.demo.features.notification.internal.application.command.SendWelcomeEmailCommand;
import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserSignedUpNotificationConsumerTest {

  private UserSignedUpNotificationConsumer consumer;
  private TestSendWelcomeEmailCommand testSendWelcomeEmailCommand;

  @BeforeEach
  void setUp() {
    testSendWelcomeEmailCommand = new TestSendWelcomeEmailCommand();
    consumer = new UserSignedUpNotificationConsumer(testSendWelcomeEmailCommand);
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
    final List<SendWelcomeEmailCommand.Input> executedInputs =
        testSendWelcomeEmailCommand.getExecutedInputs();
    assertThat(executedInputs).hasSize(1);
    assertThat(executedInputs.getFirst())
        .satisfies(
            input -> {
              assertThat(input.userId()).isEqualTo(userId);
              assertThat(input.email()).isEqualTo(email);
            });
  }

  /** テスト用SendWelcomeEmailCommand. 実行された入力をキャプチャする. */
  static class TestSendWelcomeEmailCommand extends SendWelcomeEmailCommand {

    private final List<Input> executedInputs = new ArrayList<>();

    @Override
    public Output execute(final Input input) {
      executedInputs.add(input);
      return new Output(true);
    }

    List<Input> getExecutedInputs() {
      return List.copyOf(executedInputs);
    }
  }
}
