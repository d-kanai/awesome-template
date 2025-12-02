package com.example.demo.testsupport;

import com.example.demo.shared.event.DomainEvent;
import com.example.demo.shared.event.EventPublisher;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/** テスト用EventPublisher. 発行されたイベントをキャプチャして検証可能にする. */
@Component
@Primary
public class TestEventPublisher implements EventPublisher {

  private final List<DomainEvent> publishedEvents = new ArrayList<>();

  @Override
  public void publish(final DomainEvent event) {
    publishedEvents.add(event);
  }

  @Override
  public void publishAll(final List<DomainEvent> events) {
    publishedEvents.addAll(events);
  }

  /** 発行されたイベントを取得. */
  public List<DomainEvent> getPublishedEvents() {
    return List.copyOf(publishedEvents);
  }

  /** 発行されたイベントをクリア. */
  public void clear() {
    publishedEvents.clear();
  }

  /** 指定した型のイベントを取得. */
  @SuppressWarnings("unchecked")
  public <T extends DomainEvent> List<T> getEventsOfType(final Class<T> eventType) {
    return publishedEvents.stream().filter(eventType::isInstance).map(e -> (T) e).toList();
  }
}
