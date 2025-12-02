package com.example.demo.shared;

import com.example.demo.shared.logging.AppLogger;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Global exception handler for logging unhandled exceptions. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  private final AppLogger appLogger;

  public GlobalExceptionHandler(final AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(
      final MethodArgumentNotValidException ex, final HttpServletRequest request) {
    final Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", "Bad Request");
    body.put("status", 400);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleException(
      final Exception ex, final HttpServletRequest request) {
    appLogger.logServerError(GlobalExceptionHandler.class, request, ex);

    final Map<String, Object> body = new LinkedHashMap<>();
    body.put("error", "Internal Server Error");
    body.put("status", 500);

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
