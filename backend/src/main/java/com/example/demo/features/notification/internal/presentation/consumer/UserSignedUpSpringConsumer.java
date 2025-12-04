package com.example.demo.features.notification.internal.presentation.consumer;

import com.example.demo.features.user.internal.domain.event.UserSignedUpEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Spring Event による UserSignedUpEvent を受信するコンシューマ.
 *
 * <p>パターン3: Spring Event + Domain Event
 *
 * <p>- 「ユーザーが登録した」という事実を同一プロセス内で受信 - 複数の購読者が購読可能（このクラス以外にも analytics 等が購読可能） - at-most-once のため
 * idempotency チェック不要
 *
 * <p>比較: UserSignedUpConsumer は Kafka 経由で同じ Domain Event を受信する（idempotency あり）
 */
@Component
public class UserSignedUpSpringConsumer {

  private static final Logger log = LoggerFactory.getLogger(UserSignedUpSpringConsumer.class);

  /**
   * UserSignedUpEvent を受信してログ出力.
   *
   * <p>サンプル実装のため、ログ出力のみ。 実際のユースケースでは analytics 記録などを行う。
   */
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void consume(final UserSignedUpEvent event) {
    log.info(
        "[Spring Event + Domain Event] Received UserSignedUpEvent: "
            + "eventId={}, userId={}, email={}",
        event.eventId(),
        event.userId(),
        event.email());

    // TODO: 分析データ記録など
  }
}
