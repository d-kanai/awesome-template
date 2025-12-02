package com.example.demo.shared.security;

import com.example.demo.shared.logging.AppLogger;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/** Custom authentication entry point that returns 401 Unauthorized for unauthenticated requests. */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final AppLogger appLogger;

  public JwtAuthenticationEntryPoint(AppLogger appLogger) {
    this.appLogger = appLogger;
  }

  @Override
  public void commence(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final AuthenticationException authException)
      throws IOException {
    appLogger.logUnauthorized(
        JwtAuthenticationEntryPoint.class, request, authException.getMessage());
    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
  }
}
