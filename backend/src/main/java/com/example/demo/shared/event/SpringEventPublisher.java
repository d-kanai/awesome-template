package com.example.demo.shared.event;

import com.example.demo.shared.logging.AppLogger;
import java.util.Map;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Spring Event を使用したイベント発行実装.
 *
 * <p>DomainEvent と CommandEvent の両方を Spring Event として発行する。 同一プロセス内での通信に使用。at-most-once 配信のため
 * idempotency チェック不要。
 *
 * <p>Consumer は @EventListener または @TransactionalEventListener で受信する。 テストプロファイルでは
 * TestEventPublisher が使用されるため無効化される。
 */
@Component("springEventPublisher")
public class SpringEventPublisher implements EventPublisher {

  private static final String TRANSPORT = "spring";

  private final ApplicationEventPublisher applicationEventPublisher;
  private final AppLogger appLogger;

  public SpringEventPublisher(
      final ApplicationEventPublisher applicationEventPublisher, final AppLogger appLogger) {
    this.applicationEventPublisher = applicationEventPublisher;
    this.appLogger = appLogger;
  }

  @Override
  public void publishDomainEvent(final DomainEvent event) {
    appLogger.logEventPublish(
        SpringEventPublisher.class,
        TRANSPORT,
        event.domainEventName().getValue(),
        event.eventId().toString(),
        Map.of());
    applicationEventPublisher.publishEvent(event);
  }

  @Override
  public void publishCommandEvent(final CommandEvent event) {
    appLogger.logCommandEventPublish(
        SpringEventPublisher.class,
        TRANSPORT,
        event.commandEventName().getValue(),
        Map.of("eventId", event.eventId()));
    applicationEventPublisher.publishEvent(event);
  }
}
