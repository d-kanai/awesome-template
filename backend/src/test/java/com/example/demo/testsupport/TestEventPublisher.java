package com.example.demo.testsupport;

import com.example.demo.shared.event.CommandEvent;
import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventPublisher;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * テスト用EventPublisher. 発行されたイベントをキャプチャして検証可能にする.
 *
 * <p>テストプロファイルで NoOpEventPublisher と SpringEventPublisher が無効化されるため、
 * このBeanが唯一のEventPublisher実装となり、@Qualifier での参照も解決される。
 */
@Component
@Primary
public class TestEventPublisher implements EventPublisher {

  private final List<DomainEvent> publishedDomainEvents = new ArrayList<>();
  private final List<CommandEvent> publishedCommandEvents = new ArrayList<>();

  @Override
  public void publishDomainEvent(final DomainEvent event) {
    publishedDomainEvents.add(event);
  }

  @Override
  public void publishAllDomainEvents(final List<DomainEvent> events) {
    publishedDomainEvents.addAll(events);
  }

  @Override
  public void publishCommandEvent(final CommandEvent event) {
    publishedCommandEvents.add(event);
  }

  /** 発行されたDomainEventを取得. */
  public List<DomainEvent> getPublishedDomainEvents() {
    return List.copyOf(publishedDomainEvents);
  }

  /** 発行されたCommandEventを取得. */
  public List<CommandEvent> getPublishedCommandEvents() {
    return List.copyOf(publishedCommandEvents);
  }

  /** 発行されたイベントをクリア. */
  public void clear() {
    publishedDomainEvents.clear();
    publishedCommandEvents.clear();
  }

  /** 指定した型のDomainEventを取得. */
  @SuppressWarnings("unchecked")
  public <T extends DomainEvent> List<T> getDomainEventsOfType(final Class<T> eventType) {
    return publishedDomainEvents.stream().filter(eventType::isInstance).map(e -> (T) e).toList();
  }

  /** 指定した型のCommandEventを取得. */
  @SuppressWarnings("unchecked")
  public <T extends CommandEvent> List<T> getCommandEventsOfType(final Class<T> eventType) {
    return publishedCommandEvents.stream().filter(eventType::isInstance).map(e -> (T) e).toList();
  }
}
