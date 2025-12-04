package com.example.demo.features.auth.internal.application.command;

import com.example.demo.features.auth.internal.domain.email.welcome.WelcomeEmail;
import com.example.demo.features.notification.expose.SendEmailCommandEventInput;
import com.example.demo.features.user.internal.domain.model.User;
import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.event.EventPublisher;
import com.example.demo.shared.exception.ApplicationLayerException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SignupCommand {

  private final UserRepository userRepository;
  private final EventPublisher kafkaPublisher;
  private final EventPublisher springPublisher;
  private final WelcomeEmail welcomeEmail;

  public SignupCommand(
      final UserRepository userRepository,
      @Qualifier("kafkaEventPublisher") final EventPublisher kafkaPublisher,
      @Qualifier("springEventPublisher") final EventPublisher springPublisher,
      final WelcomeEmail welcomeEmail) {
    this.userRepository = userRepository;
    this.kafkaPublisher = kafkaPublisher;
    this.springPublisher = springPublisher;
    this.welcomeEmail = welcomeEmail;
  }

  public Output execute(final Input input) {
    if (userRepository.existsByEmail(input.email())) {
      throw new ApplicationLayerException("Email already exists: " + input.email());
    }
    final User user = User.signup(input.email(), input.password());
    userRepository.insert(user);

    // Domain Event を発行（Kafka + Spring Event 両方）
    kafkaPublisher.publishAllDomainEvents(user.getDomainEvents());
    springPublisher.publishAllDomainEvents(user.getDomainEvents());

    // Welcome メール送信 CommandEvent を発行（Kafka + Spring Event 両方）
    final SendEmailCommandEventInput emailContent = welcomeEmail.create(user);
    kafkaPublisher.publishCommandEvent(emailContent);
    springPublisher.publishCommandEvent(emailContent);

    return new Output(user);
  }

  public record Input(String email, String password) {}

  public record Output(User user) {}
}
