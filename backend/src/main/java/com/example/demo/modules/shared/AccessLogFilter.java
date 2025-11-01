package com.example.demo.modules.shared;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

@Component
public class AccessLogFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(AccessLogFilter.class);

  private static final Set<String> SENSITIVE_KEYS = Set.of("password", "authorization");
  private static final String TRACE_ID_HEADER = "X-Trace-Id";
  private static final int MAX_BODY_CHAR_LENGTH = 4096;

  private final ObjectMapper objectMapper;
  private final String environmentName;

  public AccessLogFilter(ObjectMapper objectMapper, Environment environment) {
    this.objectMapper = objectMapper;
    this.environmentName = resolveEnvironment(environment);
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
    long startedAt = System.currentTimeMillis();

    try {
      filterChain.doFilter(wrappedRequest, response);
    } finally {
      long durationMs = System.currentTimeMillis() - startedAt;
      logAccess(wrappedRequest, response, startedAt, durationMs);
    }
  }

  private void logAccess(
      ContentCachingRequestWrapper request,
      HttpServletResponse response,
      long startedAt,
      long durationMs) {
    Map<String, Object> logPayload = new LinkedHashMap<>();
    logPayload.put("timestamp", formatTimestamp(startedAt));
    logPayload.put("trace_id", resolveTraceId(request));
    logPayload.put("env", environmentName);
    logPayload.put("method", request.getMethod());
    logPayload.put("path", request.getRequestURI());
    Optional.ofNullable(request.getQueryString())
        .filter(query -> !query.isBlank())
        .ifPresent(query -> logPayload.put("query", query));
    logPayload.put("status", response.getStatus());
    logPayload.put("latency_ms", durationMs);
    logPayload.put("remote_addr", request.getRemoteAddr());
    logPayload.put("user_agent", Optional.ofNullable(request.getHeader("User-Agent")).orElse("-"));
    logPayload.put("request_headers", extractHeaders(request));
    logPayload.put("request_body", extractRequestBody(request));

    try {
      log.info(objectMapper.writeValueAsString(logPayload));
    } catch (JsonProcessingException exception) {
      log.warn("Failed to serialize access log entry as JSON", exception);
      log.info(logPayload.toString());
    }
  }

  private Map<String, Object> extractHeaders(HttpServletRequest request) {
    Enumeration<String> headerNames = request.getHeaderNames();
    if (headerNames == null) {
      return Collections.emptyMap();
    }

    Map<String, Object> headers = new LinkedHashMap<>();
    while (headerNames.hasMoreElements()) {
      String headerName = headerNames.nextElement();
      List<String> values = Collections.list(request.getHeaders(headerName));
      List<String> sanitizedValues =
          values.stream()
              .map(value -> maskIfSensitive(headerName, value))
              .collect(Collectors.toList());
      if (sanitizedValues.size() == 1) {
        headers.put(headerName, sanitizedValues.get(0));
      } else {
        headers.put(headerName, sanitizedValues);
      }
    }
    return headers;
  }

  private Object extractRequestBody(ContentCachingRequestWrapper request) {
    byte[] content = request.getContentAsByteArray();
    if (content == null || content.length == 0) {
      return Collections.emptyMap();
    }

    String bodyString = toBodyString(content, request.getCharacterEncoding());
    if (bodyString.isBlank()) {
      return Collections.emptyMap();
    }
    if (bodyString.length() > MAX_BODY_CHAR_LENGTH) {
      return truncate(bodyString);
    }

    return parseBody(bodyString, request.getContentType());
  }

  private Object parseBody(String bodyString, String contentType) {
    if (isJson(contentType)) {
      return parseJsonBody(bodyString);
    }
    return truncate(bodyString);
  }

  private Object parseJsonBody(String bodyString) {
    try {
      JsonNode root = objectMapper.readTree(bodyString);
      maskSensitiveJson(root);
      return objectMapper.convertValue(root, Object.class);
    } catch (JsonProcessingException exception) {
      log.warn("Failed to parse JSON body in access log", exception);
      return truncate(bodyString);
    }
  }

  private void maskSensitiveJson(JsonNode node) {
    if (node == null) {
      return;
    }
    if (node.isObject()) {
      ObjectNode objectNode = (ObjectNode) node;
      objectNode
          .fields()
          .forEachRemaining(
              entry -> {
                if (entry.getValue().isValueNode() && isSensitiveKey(entry.getKey())) {
                  objectNode.put(entry.getKey(), "****");
                } else {
                  maskSensitiveJson(entry.getValue());
                }
              });
    } else if (node.isArray()) {
      node.forEach(this::maskSensitiveJson);
    }
  }

  private String maskIfSensitive(String key, String value) {
    if (isSensitiveKey(key)) {
      return "****";
    }
    return value;
  }

  private boolean isSensitiveKey(String key) {
    return key != null && SENSITIVE_KEYS.contains(key.toLowerCase(Locale.ROOT));
  }

  private String resolveTraceId(HttpServletRequest request) {
    return Optional.ofNullable(request.getHeader(TRACE_ID_HEADER))
        .filter(value -> !value.isBlank())
        .orElseGet(() -> String.format("%016x", ThreadLocalRandom.current().nextLong()));
  }

  private String formatTimestamp(long startedAt) {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(startedAt), ZoneId.systemDefault())
        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  private String toBodyString(byte[] content, String characterEncoding) {
    Charset charset = StandardCharsets.UTF_8;
    if (characterEncoding != null && !characterEncoding.isBlank()) {
      try {
        charset = Charset.forName(characterEncoding);
      } catch (Exception ignored) {
        // fall through to UTF-8
      }
    }
    return new String(content, charset);
  }

  private String truncate(String value) {
    if (value.length() <= MAX_BODY_CHAR_LENGTH) {
      return value;
    }
    return value.substring(0, MAX_BODY_CHAR_LENGTH) + "...";
  }

  private boolean isJson(String contentType) {
    return contentType != null && contentType.toLowerCase(Locale.ROOT).contains("application/json");
  }

  private String resolveEnvironment(Environment environment) {
    String explicit = environment.getProperty("app.env");
    if (explicit != null && !explicit.isBlank()) {
      return explicit;
    }
    String[] activeProfiles = environment.getActiveProfiles();
    if (activeProfiles.length > 0) {
      return activeProfiles[0];
    }
    return environment.getProperty("spring.profiles.active", "default");
  }
}
