package com.example.demo.shared.kafka.config;

import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.util.backoff.FixedBackOff;

/** Kafkaコンシューマ設定クラス. */
@Configuration
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaConsumerConfig {

  private static final Logger log = LoggerFactory.getLogger(KafkaConsumerConfig.class);

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
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
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
      final KafkaTemplate<String, Object> dlqKafkaTemplate) {
    final DeadLetterPublishingRecoverer recoverer =
        new DeadLetterPublishingRecoverer(dlqKafkaTemplate);
    // 3回リトライ、1秒間隔
    final DefaultErrorHandler errorHandler =
        new DefaultErrorHandler(recoverer, new FixedBackOff(1000L, 3));
    errorHandler.setRetryListeners(
        (record, ex, deliveryAttempt) ->
            log.warn(
                "Retry attempt {} for topic={}, partition={}, offset={}",
                deliveryAttempt,
                record.topic(),
                record.partition(),
                record.offset()));
    return errorHandler;
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
