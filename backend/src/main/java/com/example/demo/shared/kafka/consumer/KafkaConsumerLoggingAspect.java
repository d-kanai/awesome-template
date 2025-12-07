package com.example.demo.shared.kafka.consumer;

import com.example.demo.shared.logging.AppLogger;
import java.lang.reflect.Field;
import java.util.LinkedHashMap;
import java.util.Map;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
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

  public KafkaConsumerLoggingAspect(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @Around("@annotation(kafkaConsumerLogging)")
  public Object logAround(
      final ProceedingJoinPoint joinPoint, final KafkaConsumerLogging kafkaConsumerLogging)
      throws Throwable {

    final String eventType = kafkaConsumerLogging.eventType();
    final Class<?> consumerClass = joinPoint.getTarget().getClass();
    final Object command = joinPoint.getArgs()[0];
    final Map<String, Object> sanitizedPayload = sanitizeForLogging(command);

    // command_event_receive ログ
    appLogger.logCommandEventReceive(consumerClass, "kafka", eventType, sanitizedPayload);

    try {
      // 実際の処理
      final Object result = joinPoint.proceed();

      // command_event_finish ログ
      appLogger.logCommandEventFinish(consumerClass, "kafka", eventType, sanitizedPayload);

      return result;
    } catch (final Exception e) {
      // command_event_error ログ
      appLogger.logCommandEventError(consumerClass, "kafka", eventType, sanitizedPayload, e);

      // 例外を再スロー（Kafkaのリトライメカニズムに委ねる）
      throw e;
    }
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
