package com.example.demo.features.user.internal.application.command;

import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.notification.email.welcome.WelcomeEmail;
import com.example.demo.features.user.internal.domain.notification.slack.welcome.WelcomeSlackNotification;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.event.EventPublisher;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ユーザーサインアップコマンド.
 *
 * <p>ユーザーを新規登録し、DomainEvent/CommandEventを発行する。
 */
@Service
@Transactional
public class SignupUserCommand {

  private final UserRepository userRepository;
  private final EventPublisher kafkaPublisher;
  private final WelcomeEmail welcomeEmail;
  private final WelcomeSlackNotification welcomeSlackNotification;

  public SignupUserCommand(
      final UserRepository userRepository,
      @Qualifier("kafkaEventPublisher") final EventPublisher kafkaPublisher,
      final WelcomeEmail welcomeEmail,
      final WelcomeSlackNotification welcomeSlackNotification) {
    this.userRepository = userRepository;
    this.kafkaPublisher = kafkaPublisher;
    this.welcomeEmail = welcomeEmail;
    this.welcomeSlackNotification = welcomeSlackNotification;
  }

  public Output execute(final Input input) {
    if (userRepository.existsByEmail(input.email())) {
      throw new ApplicationLayerException("Email already exists: " + input.email());
    }

    final User user = User.signup(input.email(), input.password());
    userRepository.insert(user);

    // Domain Event を発行
    kafkaPublisher.publishAllDomainEvents(user.getDomainEvents());

    // Welcome メール送信 CommandEvent を発行
    kafkaPublisher.publishCommandEvent(welcomeEmail.create(user));

    // Slack 通知 CommandEvent を発行（内部運用通知）
    kafkaPublisher.publishCommandEvent(welcomeSlackNotification.create(user));

    // Note: Push 通知は device token がないため、ここでは送信しない
    // device token を取得する画面で SendPushNotificationCommandEventInput を発行する

    return new Output(user);
  }

  public record Input(String email, String password) {}

  public record Output(User user) {}
}
