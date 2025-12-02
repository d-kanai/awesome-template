package com.example.demo.features.notification.internal.application.command;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/** ウェルカムメール送信コマンド. */
@Service
public class SendWelcomeEmailCommand {

  private static final Logger log = LoggerFactory.getLogger(SendWelcomeEmailCommand.class);

  public Output execute(final Input input) {
    // TODO: 実際のメール送信実装
    log.info("Welcome email sent to: userId={}, email={}", input.userId(), input.email());
    return new Output(true);
  }

  public record Input(UUID userId, String email) {}

  public record Output(boolean success) {}
}
