package com.example.demo.shared.logging;

/**
 * MDC キー定数.
 *
 * <p>ログに自動付与される MDC キーを一元管理する。
 */
public final class MdcKeys {

  /** トレースID. */
  public static final String TRACE_ID = "trace_id";

  /** ユーザーID. */
  public static final String USER_ID = "user_id";

  /** 環境名. */
  public static final String ENV = "env";

  private MdcKeys() {}
}
