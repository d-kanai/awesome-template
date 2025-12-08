package com.example.demo.shared.kafka.consumer;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.event.EventMetadata;
import com.example.demo.shared.logging.AppLogger;
import com.example.demo.shared.logging.MdcKeys;
import java.lang.reflect.Field;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * KafkaConsumerLogging アノテーションを処理するAspect.
 *
 * <p>メソッド実行前に command_event_receive、実行後に command_event_finish ログを出力する。
 */
@Aspect
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaConsumerLoggingAspect {

  private static final int MAX_STRING_LENGTH = 200;

  private final AppLogger appLogger;
  private final AppProperties appProperties;

  public KafkaConsumerLoggingAspect(final AppLogger appLogger, final AppProperties appProperties) {
    this.appLogger = appLogger;
    this.appProperties = appProperties;
  }

  @Around("@annotation(kafkaConsumerLogging)")
  public Object logAround(
      final ProceedingJoinPoint joinPoint, final KafkaConsumerLogging kafkaConsumerLogging)
      throws Throwable {

    final Object command = joinPoint.getArgs()[0];
    setupMdc(command);

    try {
      return executeWithLogging(joinPoint, kafkaConsumerLogging, command);
    } finally {
      MDC.clear();
    }
  }

  private void setupMdc(final Object command) {
    MDC.put(MdcKeys.TRACE_ID, extractTraceIdFromEvent(command));
    MDC.put(MdcKeys.ENV, appProperties.getEnv().name());
  }

  private Object executeWithLogging(
      final ProceedingJoinPoint joinPoint,
      final KafkaConsumerLogging kafkaConsumerLogging,
      final Object command)
      throws Throwable {
    final String eventType = kafkaConsumerLogging.eventType();
    final Class<?> consumerClass = joinPoint.getTarget().getClass();
    final Map<String, Object> sanitizedPayload = sanitizeForLogging(command);

    appLogger.logCommandEventReceive(consumerClass, "kafka", eventType, sanitizedPayload);

    try {
      final Object result = joinPoint.proceed();
      appLogger.logCommandEventFinish(consumerClass, "kafka", eventType, sanitizedPayload);
      return result;
    } catch (final Exception e) {
      appLogger.logCommandEventError(consumerClass, "kafka", eventType, sanitizedPayload, e);
      throw e;
    }
  }

  private String extractTraceIdFromEvent(final Object event) {
    try {
      final Field metadataField = event.getClass().getDeclaredField("metadata");
      metadataField.setAccessible(true);
      final Object metadata = metadataField.get(event);
      if (metadata instanceof EventMetadata eventMetadata && eventMetadata.traceId() != null) {
        return eventMetadata.traceId();
      }
    } catch (final NoSuchFieldException | IllegalAccessException ignored) {
      // フィールドがない場合は新規生成
    }
    return String.format("%016x", ThreadLocalRandom.current().nextLong());
  }

  /** ログ出力用にペイロードをサニタイズする（長い文字列を切り詰める）. */
  private Map<String, Object> sanitizeForLogging(final Object obj) {
    final Map<String, Object> result = new LinkedHashMap<>();
    if (obj == null) {
      return result;
    }

    for (final Field field : obj.getClass().getDeclaredFields()) {
      field.setAccessible(true);
      try {
        final Object value = field.get(obj);
        result.put(field.getName(), truncateIfNeeded(value));
      } catch (final IllegalAccessException e) {
        result.put(field.getName(), "<access error>");
      }
    }
    return result;
  }

  /** 長い文字列を切り詰める. */
  private Object truncateIfNeeded(final Object value) {
    if (value instanceof String str && str.length() > MAX_STRING_LENGTH) {
      return str.substring(0, MAX_STRING_LENGTH) + "...(truncated)";
    }
    return value;
  }
}
