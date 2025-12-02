package com.example.demo.shared;

import com.example.demo.shared.jwt.JwtClaims;
import com.example.demo.shared.logging.AppLogger;
import com.example.demo.shared.logging.AppLogger.AccessLog;
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
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

@Component
public class AccessLogFilter extends OncePerRequestFilter {

  private static final Set<String> SENSITIVE_KEYS = Set.of("password", "authorization");
  private static final int MAX_BODY_CHAR_LENGTH = 4096;

  private final ObjectMapper objectMapper;
  private final AppLogger appLogger;

  public AccessLogFilter(final ObjectMapper objectMapper, final AppLogger appLogger) {
    this.objectMapper = objectMapper;
    this.appLogger = appLogger;
  }

  @Override
  protected void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain)
      throws ServletException, IOException {
    final int contentLength = request.getContentLength();
    final ContentCachingRequestWrapper wrappedRequest =
        new ContentCachingRequestWrapper(request, contentLength > 0 ? contentLength : 1024);
    final long startedAt = System.currentTimeMillis();

    try {
      filterChain.doFilter(wrappedRequest, response);
    } finally {
      final long durationMs = System.currentTimeMillis() - startedAt;
      logAccess(wrappedRequest, response, startedAt, durationMs);
    }
  }

  private void logAccess(
      final ContentCachingRequestWrapper request,
      final HttpServletResponse response,
      final long startedAt,
      final long durationMs) {
    final var accessLog =
        new AccessLog(
            formatTimestamp(startedAt),
            appLogger.resolveTraceId(request),
            appLogger.env(),
            request.getMethod(),
            request.getRequestURI(),
            blankToNull(request.getQueryString()),
            response.getStatus(),
            durationMs,
            request.getRemoteAddr(),
            Optional.ofNullable(request.getHeader("User-Agent")).orElse("-"),
            extractUserId().orElse(null),
            extractHeaders(request),
            extractRequestBody(request));

    appLogger.logAccess(AccessLogFilter.class, accessLog);
  }

  private Map<String, Object> extractHeaders(final HttpServletRequest request) {
    final Enumeration<String> headerNames = request.getHeaderNames();
    if (headerNames == null) {
      return Collections.emptyMap();
    }

    final Map<String, Object> headers = new LinkedHashMap<>();
    while (headerNames.hasMoreElements()) {
      final String headerName = headerNames.nextElement();
      final List<String> values = Collections.list(request.getHeaders(headerName));
      final List<String> sanitizedValues =
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

  private Object extractRequestBody(final ContentCachingRequestWrapper request) {
    final byte[] content = request.getContentAsByteArray();
    if (content == null || content.length == 0) {
      return null;
    }

    final String bodyString = toBodyString(content, request.getCharacterEncoding());
    if (bodyString.isBlank()) {
      return null;
    }
    if (bodyString.length() > MAX_BODY_CHAR_LENGTH) {
      return truncate(bodyString);
    }

    return parseBody(bodyString, request.getContentType());
  }

  private Object parseBody(final String bodyString, final String contentType) {
    if (isJson(contentType)) {
      return parseJsonBody(bodyString);
    }
    return truncate(bodyString);
  }

  private Object parseJsonBody(final String bodyString) {
    try {
      final JsonNode root = objectMapper.readTree(bodyString);
      maskSensitiveJson(root);
      return objectMapper.convertValue(root, Object.class);
    } catch (final JacksonException ignored) {
      // JSON parse失敗時は生の文字列をログに含める
      return truncate(bodyString);
    }
  }

  private void maskSensitiveJson(final JsonNode node) {
    if (node == null) {
      return;
    }
    if (node.isObject()) {
      final ObjectNode objectNode = (ObjectNode) node;
      objectNode
          .properties()
          .forEach(
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

  private String maskIfSensitive(final String key, final String value) {
    if (isSensitiveKey(key)) {
      return "****";
    }
    return value;
  }

  private boolean isSensitiveKey(final String key) {
    return key != null && SENSITIVE_KEYS.contains(key.toLowerCase(Locale.ROOT));
  }

  private Optional<String> extractUserId() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated()) {
      final Object principal = authentication.getPrincipal();
      if (principal instanceof JwtClaims claims) {
        return Optional.ofNullable(claims.userId());
      }
    }
    return Optional.empty();
  }

  private String formatTimestamp(final long startedAt) {
    return OffsetDateTime.ofInstant(Instant.ofEpochMilli(startedAt), ZoneId.systemDefault())
        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  private String toBodyString(final byte[] content, final String characterEncoding) {
    Charset charset = StandardCharsets.UTF_8;
    if (characterEncoding != null && !characterEncoding.isBlank()) {
      try {
        charset = Charset.forName(characterEncoding);
      } catch (final Exception ignored) {
        // fall through to UTF-8
      }
    }
    return new String(content, charset);
  }

  private String truncate(final String value) {
    if (value.length() <= MAX_BODY_CHAR_LENGTH) {
      return value;
    }
    return value.substring(0, MAX_BODY_CHAR_LENGTH) + "...";
  }

  private boolean isJson(final String contentType) {
    return contentType != null && contentType.toLowerCase(Locale.ROOT).contains("application/json");
  }

  private String blankToNull(final String value) {
    return (value != null && !value.isBlank()) ? value : null;
  }
}
