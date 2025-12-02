package com.example.demo.shared.kafka.health;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.DescribeClusterOptions;
import org.apache.kafka.common.Node;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;

/** Kafkaヘルスインジケーター. */
@Component("kafka")
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaHealthIndicator implements HealthIndicator {

  private static final int TIMEOUT_SECONDS = 5;

  private final String bootstrapServers;

  public KafkaHealthIndicator(
      @Value("${spring.kafka.bootstrap-servers}") final String bootstrapServers) {
    this.bootstrapServers = bootstrapServers;
  }

  @Override
  public Health health() {
    try (final AdminClient adminClient = AdminClient.create(createConfig())) {
      return checkClusterHealth(adminClient);
    } catch (final InterruptedException e) {
      Thread.currentThread().interrupt();
      return buildDownHealth("Interrupted while checking Kafka health", null);
    } catch (final Exception e) {
      return buildDownHealth("Failed to connect to Kafka", e.getMessage());
    }
  }

  private Map<String, Object> createConfig() {
    final Map<String, Object> config = new HashMap<>();
    config.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    config.put(AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, TIMEOUT_SECONDS * 1000);
    config.put(AdminClientConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, TIMEOUT_SECONDS * 1000);
    return config;
  }

  private Health checkClusterHealth(final AdminClient adminClient) throws Exception {
    final var options = new DescribeClusterOptions().timeoutMs(TIMEOUT_SECONDS * 1000);
    final var clusterResult = adminClient.describeCluster(options);
    final String clusterId = clusterResult.clusterId().get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
    final Collection<Node> nodes = clusterResult.nodes().get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
    return Health.up()
        .withDetail("clusterId", clusterId)
        .withDetail("nodeCount", nodes.size())
        .withDetail("bootstrapServers", bootstrapServers)
        .build();
  }

  private Health buildDownHealth(final String error, final String cause) {
    final var builder = Health.down().withDetail("error", error);
    if (cause != null) {
      builder.withDetail("cause", cause);
    }
    return builder.withDetail("bootstrapServers", bootstrapServers).build();
  }
}
