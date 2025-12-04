package com.example.demo.shared.kafka.config;

import com.example.demo.shared.logging.AppLogger;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.util.backoff.FixedBackOff;

/** Kafkaコンシューマ設定クラス. */
@Configuration
@EnableKafka
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaConsumerConfig {

  @Value("${spring.kafka.bootstrap-servers}")
  private String bootstrapServers;

  @Value("${spring.application.name}")
  private String applicationName;

  /** ConsumerFactoryの設定. */
  @Bean
  public ConsumerFactory<String, Object> consumerFactory() {
    final Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    props.put(ConsumerConfig.GROUP_ID_CONFIG, applicationName);
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.example.demo.*");
    return new DefaultKafkaConsumerFactory<>(props);
  }

  /** DLQ用ProducerFactory. */
  @Bean
  public ProducerFactory<String, Object> dlqProducerFactory() {
    final Map<String, Object> props = new HashMap<>();
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    return new DefaultKafkaProducerFactory<>(props);
  }

  /** DLQ用KafkaTemplate. */
  @Bean
  public KafkaTemplate<String, Object> dlqKafkaTemplate(
      final ProducerFactory<String, Object> dlqProducerFactory) {
    return new KafkaTemplate<>(dlqProducerFactory);
  }

  /** エラーハンドラ（DLQ付き）. */
  @Bean
  public DefaultErrorHandler kafkaErrorHandler(
      final KafkaTemplate<String, Object> dlqKafkaTemplate, final AppLogger appLogger) {
    final var loggingRecoverer = createLoggingRecoverer(dlqKafkaTemplate, appLogger);
    final DefaultErrorHandler errorHandler =
        new DefaultErrorHandler(loggingRecoverer, new FixedBackOff(1000L, 3));
    errorHandler.setRetryListeners(
        (record, ex, deliveryAttempt) ->
            appLogger.logKafkaConsumerRetry(
                KafkaConsumerConfig.class,
                record.topic(),
                record.partition(),
                record.offset(),
                deliveryAttempt,
                ex));
    return errorHandler;
  }

  /** DLQ送信前にエラーログを出力するRecovererを作成. */
  private org.springframework.kafka.listener.ConsumerRecordRecoverer createLoggingRecoverer(
      final KafkaTemplate<String, Object> dlqKafkaTemplate, final AppLogger appLogger) {
    final DeadLetterPublishingRecoverer dlqRecoverer =
        new DeadLetterPublishingRecoverer(dlqKafkaTemplate);
    return (record, ex) -> {
      appLogger.logKafkaConsumerFailed(
          KafkaConsumerConfig.class, record.topic(), record.partition(), record.offset(), ex);
      try {
        dlqRecoverer.accept(record, ex);
      } catch (final Exception dlqEx) {
        appLogger.logKafkaConsumerFailed(
            KafkaConsumerConfig.class,
            record.topic() + ".DLT",
            record.partition(),
            record.offset(),
            dlqEx);
      }
    };
  }

  /** KafkaListenerContainerFactory. */
  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory(
      final ConsumerFactory<String, Object> consumerFactory,
      final DefaultErrorHandler kafkaErrorHandler) {
    final ConcurrentKafkaListenerContainerFactory<String, Object> factory =
        new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory);
    factory.setCommonErrorHandler(kafkaErrorHandler);
    factory.setConcurrency(3);
    return factory;
  }
}
