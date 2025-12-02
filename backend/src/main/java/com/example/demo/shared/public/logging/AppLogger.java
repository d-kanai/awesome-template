package com.example.demo.shared.logging;

import static net.logstash.logback.argument.StructuredArguments.kv;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.time.AppClock;
import jakarta.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class AppLogger {

  private static final String TRACE_ID_HEADER = "X-Trace-Id";

  private final AppProperties appProperties;
  private final RequestContext requestContext;

  public AppLogger(final AppProperties appProperties, final RequestContext requestContext) {
    this.appProperties = appProperties;
    this.requestContext = requestContext;
  }

  /** リクエストコンテキストを初期化. */
  public void initContext(final HttpServletRequest request) {
    requestContext.setTraceId(resolveTraceId(request));
    requestContext.setEnv(appProperties.getEnv().name());
  }

  /** ユーザーIDを設定. */
  public void setUserId(final String userId) {
    requestContext.setUserId(userId);
  }

  /** アクセスログを出力. */
  public void logAccess(final Class<?> clazz, final AccessLog log) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.info(
        "Access log",
        kv("log_type", "access"),
        kv("trace_id", requestContext.getTraceId()),
        kv("user_id", requestContext.getUserId()),
        kv("env", requestContext.getEnv()),
        kv("timestamp", log.timestamp()),
        kv("method", log.method()),
        kv("path", log.path()),
        kv("query", log.query()),
        kv("status", log.status()),
        kv("latency_ms", log.latencyMs()),
        kv("remote_addr", log.remoteAddr()),
        kv("user_agent", log.userAgent()),
        kv("request_headers", log.requestHeaders()),
        kv("request_body", log.requestBody()));
  }

  /** 認証エラー(401)ログを出力. */
  public void logUnauthorized(
      final Class<?> clazz, final HttpServletRequest request, final String errorMessage) {
    final Logger logger = LoggerFactory.getLogger(clazz);

    // コンテキストが未設定の場合は設定する
    if (requestContext.getTraceId() == null) {
      initContext(request);
    }

    logger.warn(
        "Unauthorized access",
        kv("log_type", "unauthorized"),
        kv("trace_id", requestContext.getTraceId()),
        kv("env", requestContext.getEnv()),
        kv("timestamp", now()),
        kv("method", request.getMethod()),
        kv("path", request.getRequestURI()),
        kv("query", blankToNull(request.getQueryString())),
        kv("status", 401),
        kv("remote_addr", request.getRemoteAddr()),
        kv("user_agent", Optional.ofNullable(request.getHeader("User-Agent")).orElse("-")),
        kv("error", errorMessage));
  }

  /** サーバーエラー(500)ログを出力. */
  public void logServerError(
      final Class<?> clazz, final HttpServletRequest request, final Exception ex) {
    final Logger logger = LoggerFactory.getLogger(clazz);

    // コンテキストが未設定の場合は設定する
    if (requestContext.getTraceId() == null) {
      initContext(request);
    }

    logger.error(
        "Server error",
        kv("log_type", "server_error"),
        kv("trace_id", requestContext.getTraceId()),
        kv("env", requestContext.getEnv()),
        kv("timestamp", now()),
        kv("method", request.getMethod()),
        kv("path", request.getRequestURI()),
        kv("query", blankToNull(request.getQueryString())),
        kv("status", 500),
        kv("remote_addr", request.getRemoteAddr()),
        kv("error_type", ex.getClass().getName()),
        kv("error_message", ex.getMessage()),
        kv("stacktrace", getStackTraceAsString(ex)));
  }

  /** リクエストからtrace_idを取得または生成. */
  public String resolveTraceId(final HttpServletRequest request) {
    return Optional.ofNullable(request.getHeader(TRACE_ID_HEADER))
        .filter(value -> !value.isBlank())
        .orElseGet(() -> String.format("%016x", ThreadLocalRandom.current().nextLong()));
  }

  /** 現在時刻をISO形式で取得. */
  public String now() {
    return AppClock.nowAsIsoString();
  }

  /** 環境名を取得. */
  public String env() {
    return appProperties.getEnv().name();
  }

  /** Jobの開始ログを出力. */
  public void logJobStart(final Class<?> clazz, final String jobName, final Object args) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.info(
        "Job started",
        kv("log_type", "job_start"),
        kv("env", appProperties.getEnv().name()),
        kv("timestamp", now()),
        kv("job_name", jobName),
        kv("args", args));
  }

  /** Jobの完了ログを出力. */
  public void logJobComplete(final Class<?> clazz, final String jobName, final long durationMs) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.info(
        "Job completed",
        kv("log_type", "job_complete"),
        kv("env", appProperties.getEnv().name()),
        kv("timestamp", now()),
        kv("job_name", jobName),
        kv("duration_ms", durationMs));
  }

  /** Jobのエラーログを出力. */
  public void logJobError(
      final Class<?> clazz, final String jobName, final Exception ex, final long durationMs) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.error(
        "Job failed",
        kv("log_type", "job_error"),
        kv("env", appProperties.getEnv().name()),
        kv("timestamp", now()),
        kv("job_name", jobName),
        kv("duration_ms", durationMs),
        kv("error_type", ex.getClass().getName()),
        kv("error_message", ex.getMessage()),
        kv("stacktrace", getStackTraceAsString(ex)));
  }

  /** Consumerの起動ログを出力. */
  public void logConsumerStart() {
    final Logger logger = LoggerFactory.getLogger(AppLogger.class);
    logger.info(
        "Consumer started",
        kv("log_type", "consumer_start"),
        kv("env", appProperties.getEnv().name()),
        kv("timestamp", now()));
  }

  private String getStackTraceAsString(final Exception ex) {
    final StringWriter sw = new StringWriter();
    ex.printStackTrace(new PrintWriter(sw));
    return sw.toString();
  }

  private @Nullable String blankToNull(final @Nullable String value) {
    return (value != null && !value.isBlank()) ? value : null;
  }

  /** DB更新スキップ警告ログを出力. */
  public void logDbUpdateSkipped(final Class<?> clazz, final String entity, final String id) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.warn(
        "DB update skipped: no changes detected",
        kv("log_type", "db_update_skipped"),
        kv("trace_id", requestContext.getTraceId()),
        kv("env", requestContext.getEnv()),
        kv("timestamp", now()),
        kv("entity", entity),
        kv("id", id));
  }

  /** DB更新ログを出力. */
  public void logDbUpdate(final Class<?> clazz, final DbUpdateLog log) {
    final Logger logger = LoggerFactory.getLogger(clazz);
    logger.info(
        "DB update",
        kv("log_type", "db_update"),
        kv("trace_id", requestContext.getTraceId()),
        kv("user_id", requestContext.getUserId()),
        kv("env", requestContext.getEnv()),
        kv("timestamp", now()),
        kv("entity", log.entity()),
        kv("changes", log.changes()));
  }

  /** DB更新ログ. */
  public record DbUpdateLog(String entity, Object changes) {}

  /** アクセスログ. */
  public record AccessLog(
      String timestamp,
      String method,
      String path,
      @Nullable String query,
      int status,
      long latencyMs,
      String remoteAddr,
      String userAgent,
      Object requestHeaders,
      @Nullable Object requestBody) {}
}
