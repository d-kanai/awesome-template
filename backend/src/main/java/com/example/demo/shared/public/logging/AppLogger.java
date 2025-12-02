package com.example.demo.shared.logging;

import com.example.demo.shared.config.AppProperties;
import com.example.demo.shared.time.AppClock;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * アプリケーション全体で使用するログユーティリティ.
 *
 * <p>環境に応じてJSON形式でログを出力する。 STAGING/PRODUCTIONではcompact JSON、DEVELOPMENT/TESTではpretty print JSONを使用。
 */
@Component
public class AppLogger {

  private static final String TRACE_ID_HEADER = "X-Trace-Id";

  private final AppProperties appProperties;
  private final tools.jackson.databind.ObjectWriter compactWriter;
  private final tools.jackson.databind.ObjectWriter prettyWriter;

  public AppLogger(ObjectMapper objectMapper, AppProperties appProperties) {
    this.appProperties = appProperties;
    this.compactWriter = objectMapper.writer();
    this.prettyWriter = objectMapper.writerWithDefaultPrettyPrinter();
  }

  /** アクセスログを出力. */
  public void logAccess(Class<?> clazz, AccessLog log) {
    logJson(clazz, LogLevel.INFO, log);
  }

  /** 認証エラー(401)ログを出力. */
  public void logUnauthorized(Class<?> clazz, HttpServletRequest request, String errorMessage) {
    var log =
        new UnauthorizedLog(
            now(),
            resolveTraceId(request),
            appProperties.getEnv().name(),
            request.getMethod(),
            request.getRequestURI(),
            blankToNull(request.getQueryString()),
            401,
            request.getRemoteAddr(),
            Optional.ofNullable(request.getHeader("User-Agent")).orElse("-"),
            errorMessage);
    logJson(clazz, LogLevel.WARN, log);
  }

  /** サーバーエラー(500)ログを出力. */
  public void logServerError(Class<?> clazz, HttpServletRequest request, Exception ex) {
    var log =
        new ServerErrorLog(
            now(),
            resolveTraceId(request),
            appProperties.getEnv().name(),
            request.getMethod(),
            request.getRequestURI(),
            blankToNull(request.getQueryString()),
            500,
            request.getRemoteAddr(),
            ex.getClass().getName(),
            ex.getMessage(),
            getStackTraceAsString(ex));
    logJson(clazz, LogLevel.ERROR, log);
  }

  /** リクエストからtrace_idを取得または生成. */
  public String resolveTraceId(HttpServletRequest request) {
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

  private void logJson(Class<?> clazz, LogLevel level, Object payload) {
    Logger logger = LoggerFactory.getLogger(clazz);
    try {
      var writer = appProperties.shouldUseJsonLog() ? compactWriter : prettyWriter;
      String json = writer.writeValueAsString(payload);
      switch (level) {
        case INFO -> logger.info(json);
        case WARN -> logger.warn(json);
        case ERROR -> logger.error(json);
      }
    } catch (JacksonException e) {
      logger.warn("Failed to serialize log entry as JSON");
      switch (level) {
        case INFO -> logger.info(payload.toString());
        case WARN -> logger.warn(payload.toString());
        case ERROR -> logger.error(payload.toString());
      }
    }
  }

  private String getStackTraceAsString(Exception ex) {
    StringWriter sw = new StringWriter();
    ex.printStackTrace(new PrintWriter(sw));
    return sw.toString();
  }

  private String blankToNull(String value) {
    return (value != null && !value.isBlank()) ? value : null;
  }

  private enum LogLevel {
    INFO,
    WARN,
    ERROR
  }

  /** アクセスログ. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record AccessLog(
      String timestamp,
      @JsonProperty("trace_id") String traceId,
      String env,
      String method,
      String path,
      String query,
      int status,
      @JsonProperty("latency_ms") long latencyMs,
      @JsonProperty("remote_addr") String remoteAddr,
      @JsonProperty("user_agent") String userAgent,
      @JsonProperty("user_id") String userId,
      @JsonProperty("request_headers") Object requestHeaders,
      @JsonProperty("request_body") Object requestBody) {}

  /** 認証エラーログ. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record UnauthorizedLog(
      String timestamp,
      @JsonProperty("trace_id") String traceId,
      String env,
      String method,
      String path,
      String query,
      int status,
      @JsonProperty("remote_addr") String remoteAddr,
      @JsonProperty("user_agent") String userAgent,
      String error) {}

  /** サーバーエラーログ. */
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record ServerErrorLog(
      String timestamp,
      @JsonProperty("trace_id") String traceId,
      String env,
      String method,
      String path,
      String query,
      int status,
      @JsonProperty("remote_addr") String remoteAddr,
      @JsonProperty("error_type") String errorType,
      @JsonProperty("error_message") String errorMessage,
      String stacktrace) {}
}
