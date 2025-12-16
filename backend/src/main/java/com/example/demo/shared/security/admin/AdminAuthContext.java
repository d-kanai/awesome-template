package com.example.demo.shared.security.admin;

import com.example.demo.shared.exception.ApplicationLayerException;
import com.example.demo.shared.jwt.AuthPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AdminAuthContext {

  private AdminAuthContext() {}

  public static AuthPrincipal getCurrentPrincipal() {
    final var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      throw new ApplicationLayerException("Authentication required");
    }
    if (!(authentication.getPrincipal() instanceof AuthPrincipal principal)) {
      throw new ApplicationLayerException("Invalid authentication principal");
    }
    return principal;
  }

  public static String getCurrentAdminId() {
    return getCurrentPrincipal().userId();
  }

  public static String getCurrentEmail() {
    return getCurrentPrincipal().email();
  }
}
