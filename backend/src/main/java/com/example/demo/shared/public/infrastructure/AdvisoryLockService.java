package com.example.demo.shared.infrastructure;

import static org.jooq.impl.DSL.val;

import java.util.UUID;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

/**
 * PostgreSQL Advisory Lock を使った排他制御サービス.
 *
 * <p>トランザクション内で呼び出すと、トランザクション終了時に自動解放される。 同じキーに対する複数のリクエストは直列化される（後続はwait）。
 */
@Service
public class AdvisoryLockService {

  private final DSLContext dsl;

  public AdvisoryLockService(final DSLContext dsl) {
    this.dsl = dsl;
  }

  /**
   * UUIDに基づくアドバイザリーロックを取得.
   *
   * @param key ロックキー（例: userId）
   */
  public void acquireLock(final UUID key) {
    // H2 (テスト用) では pg_advisory_xact_lock が存在しないためスキップ
    final String dialect = dsl.dialect().getName();
    if (dialect.toLowerCase().contains("h2")) {
      return;
    }
    dsl.execute("SELECT pg_advisory_xact_lock({0})", val(key.hashCode()));
  }

  /**
   * 文字列に基づくアドバイザリーロックを取得.
   *
   * @param key ロックキー
   */
  public void acquireLock(final String key) {
    final String dialect = dsl.dialect().getName();
    if (dialect.toLowerCase().contains("h2")) {
      return;
    }
    dsl.execute("SELECT pg_advisory_xact_lock({0})", val(key.hashCode()));
  }
}
