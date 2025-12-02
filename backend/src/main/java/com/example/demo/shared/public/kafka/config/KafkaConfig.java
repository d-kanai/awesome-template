package com.example.demo.shared.kafka.config;

import com.example.demo.shared.event.DomainEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

/** Kafka設定クラス. */
@Configuration
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaConfig {

  @Value("${spring.kafka.bootstrap-servers}")
  private String bootstrapServers;

  /** KafkaAdmin設定（ヘルスチェック・トピック管理用）. */
  @Bean
  public KafkaAdmin kafkaAdmin() {
    final Map<String, Object> configs = new HashMap<>();
    configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    return new KafkaAdmin(configs);
  }

  /** user-eventsトピックの作成. */
  @Bean
  public NewTopic userEventsTopic() {
    return TopicBuilder.name("demo.user.events").partitions(3).replicas(1).build();
  }

  /** DLQトピックの作成. */
  @Bean
  public NewTopic dlqTopic() {
    return TopicBuilder.name("demo.dlq").partitions(1).replicas(1).build();
  }

  /** KafkaProducerFactoryの設定. */
  @Bean
  public ProducerFactory<String, DomainEvent> producerFactory() {
    final Map<String, Object> configProps = new HashMap<>();
    configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    configProps.put(ProducerConfig.ACKS_CONFIG, "all");
    configProps.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);

    // ISO-8601形式で日時をシリアライズするObjectMapper
    final ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    final JsonSerializer<DomainEvent> jsonSerializer = new JsonSerializer<>(objectMapper);
    return new DefaultKafkaProducerFactory<>(configProps, new StringSerializer(), jsonSerializer);
  }

  /** KafkaTemplateの設定. */
  @Bean
  public KafkaTemplate<String, DomainEvent> kafkaTemplate(
      final ProducerFactory<String, DomainEvent> producerFactory) {
    return new KafkaTemplate<>(producerFactory);
  }
}
