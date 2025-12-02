package com.example.demo.shared.consumer;

import com.example.demo.shared.logging.AppLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Kafkaコンシューマの起動ランナー.
 *
 * <p>--mode=consumer で起動された場合、コンシューマとして常駐する。 KafkaListenerは自動的にメッセージを受信し続ける。
 */
@Component
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class ConsumerRunner implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(ConsumerRunner.class);

  private final AppLogger appLogger;

  public ConsumerRunner(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @Override
  public void run(final ApplicationArguments args) throws Exception {
    if (!args.containsOption("mode")) {
      return;
    }

    final var modeValues = args.getOptionValues("mode");
    if (modeValues == null || modeValues.isEmpty()) {
      return;
    }

    final String mode = modeValues.get(0);
    if (!"consumer".equals(mode)) {
      return;
    }

    log.info("Consumer mode started. Listening for Kafka messages...");
    appLogger.logConsumerStart();

    // KafkaListenerが自動的にメッセージを受信するため、
    // ここでは起動ログを出力するのみ。
    // アプリケーションは終了せず常駐する。
  }
}
