package com.example.demo.shared.exception;

import com.example.demo.shared.logging.AppLogger;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private final AppLogger appLogger;

  public GlobalExceptionHandler(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @ExceptionHandler(ApplicationLayerException.class)
  public ResponseEntity<Map<String, Object>> handleApplicationLayerException(
      final ApplicationLayerException ex, final HttpServletRequest request) {
    return badRequest(Objects.requireNonNullElse(ex.getMessage(), "Bad Request"));
  }

  @ExceptionHandler(DomainLayerException.class)
  public ResponseEntity<Map<String, Object>> handleDomainLayerException(
      final DomainLayerException ex, final HttpServletRequest request) {
    return badRequest(Objects.requireNonNullElse(ex.getMessage(), "Bad Request"));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(
      final MethodArgumentNotValidException ex, final HttpServletRequest request) {
    return badRequest("Bad Request");
  }

  @ExceptionHandler(InfraLayerException.class)
  public ResponseEntity<Map<String, Object>> handleInfraLayerException(
      final InfraLayerException ex, final HttpServletRequest request) {
    appLogger.logServerError(GlobalExceptionHandler.class, request, ex);
    return internalServerError();
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleException(
      final Exception ex, final HttpServletRequest request) {
    appLogger.logServerError(GlobalExceptionHandler.class, request, ex);
    return internalServerError();
  }

  private ResponseEntity<Map<String, Object>> badRequest(final String message) {
    final Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", message);
    body.put("status", 400);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  private ResponseEntity<Map<String, Object>> internalServerError() {
    final Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", "Internal Server Error");
    body.put("status", 500);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
