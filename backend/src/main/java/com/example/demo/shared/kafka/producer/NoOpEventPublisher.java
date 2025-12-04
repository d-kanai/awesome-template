package com.example.demo.shared.kafka.producer;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventPublisher;
import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Kafka 無効時のイベント発行実装（ログ出力のみ）.
 *
 * <p>開発・テスト環境で Kafka を使用しない場合に使用。 テストプロファイルでは TestEventPublisher が使用されるため無効化される。
 */
@Component("kafkaEventPublisher")
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "false", matchIfMissing = true)
@Profile("!test")
public class NoOpEventPublisher implements EventPublisher {

  private static final String TRANSPORT = "noop";

  private final AppLogger appLogger;

  public NoOpEventPublisher(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @Override
  public void publishDomainEvent(final DomainEvent event) {
    appLogger.logEventPublish(
        NoOpEventPublisher.class,
        TRANSPORT,
        event.domainEventName().getValue(),
        event.eventId().toString(),
        Map.of("status", "skipped", "reason", "Kafka disabled"));
  }

  @Override
  public void publishCommandEvent(final CommandEvent event) {
    appLogger.logCommandEventPublish(
        NoOpEventPublisher.class,
        TRANSPORT,
        event.commandEventName().getValue(),
        Map.of(
            "eventId", event.eventId(),
            "status", "skipped",
            "reason", "Kafka disabled"));
  }
}
