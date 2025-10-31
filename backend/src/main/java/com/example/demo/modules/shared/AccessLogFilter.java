package com.example.demo.modules.shared;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class AccessLogFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(AccessLogFilter.class);

  private static final Set<String> SENSITIVE_PARAMETER_KEYS = Set.of("password");

  private final ObjectMapper objectMapper;

  public AccessLogFilter(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    long startedAt = System.currentTimeMillis();

    try {
      filterChain.doFilter(request, response);
    } finally {
      long durationMs = System.currentTimeMillis() - startedAt;
      Map<String, Object> logPayload = new LinkedHashMap<>();
      logPayload.put("when", Instant.ofEpochMilli(startedAt).toString());
      logPayload.put("who", extractWho(request));
      logPayload.put("where", extractWhere(request));
      logPayload.put("what", request.getMethod());
      logPayload.put("why", extractParameters(request));
      logPayload.put("how", buildHow(response, durationMs));

      writeAsJson(logPayload);
    }
  }

  private void writeAsJson(Map<String, Object> logPayload) {
    try {
      log.info(objectMapper.writeValueAsString(logPayload));
    } catch (JsonProcessingException exception) {
      log.warn("Failed to serialize access log entry as JSON", exception);
      log.info(logPayload.toString());
    }
  }

  private Map<String, Object> extractWho(HttpServletRequest request) {
    Map<String, Object> who = new LinkedHashMap<>();
    Optional.ofNullable(request.getUserPrincipal())
        .map(Principal::getName)
        .ifPresent(username -> who.put("principal", username));
    who.put("remoteAddr", request.getRemoteAddr());
    return who;
  }

  private String extractWhere(HttpServletRequest request) {
    String uri = request.getRequestURI();
    String query = request.getQueryString();
    if (query == null || query.isBlank()) {
      return uri;
    }
    return uri + "?" + query;
  }

  private Map<String, Object> extractParameters(HttpServletRequest request) {
    Map<String, Object> parameters = new LinkedHashMap<>();
    request.getParameterMap()
        .entrySet()
        .stream()
        .sorted(Map.Entry.comparingByKey())
        .forEach(entry -> parameters.put(entry.getKey(), maskIfNecessary(entry)));
    return parameters;
  }

  private Object maskIfNecessary(Map.Entry<String, String[]> entry) {
    String[] rawValues = entry.getValue();
    if (rawValues == null || rawValues.length == 0) {
      return "";
    }

    List<String> values = new ArrayList<>(rawValues.length);
    for (String value : rawValues) {
      if (isSensitive(entry.getKey())) {
        values.add("****");
      } else {
        values.add(value);
      }
    }
    if (values.size() == 1) {
      return values.get(0);
    }
    return values;
  }

  private boolean isSensitive(String key) {
    return SENSITIVE_PARAMETER_KEYS.contains(key.toLowerCase(Locale.ROOT));
  }

  private Map<String, Object> buildHow(HttpServletResponse response, long durationMs) {
    Map<String, Object> how = new LinkedHashMap<>();
    how.put("status", response.getStatus());
    how.put("durationMs", durationMs);
    return how;
  }
}
