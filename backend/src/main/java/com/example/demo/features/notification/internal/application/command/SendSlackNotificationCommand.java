package com.example.demo.features.notification.internal.application.command;

import com.example.demo.features.notification.expose.SendSlackNotificationCommandEventInput;
import com.example.demo.features.notification.internal.infrastructure.slack.SlackNotificationSender;
import org.springframework.stereotype.Service;

/**
 * Slack通知送信コマンド.
 *
 * <p>SendSlackNotificationCommandEventInput を受け取り、Slack通知を送信する。
 * 通知内容は呼び出し側が決定済みのため、このクラスはビジネスロジックを持たない。
 */
@Service
public class SendSlackNotificationCommand {

  private final SlackNotificationSender slackNotificationSender;

  public SendSlackNotificationCommand(final SlackNotificationSender slackNotificationSender) {
    this.slackNotificationSender = slackNotificationSender;
  }

  public void execute(final SendSlackNotificationCommandEventInput command) {
    slackNotificationSender.send(
        command.eventId(),
        command.channel(),
        command.text(),
        command.notificationType(),
        command.userId());
  }
}
