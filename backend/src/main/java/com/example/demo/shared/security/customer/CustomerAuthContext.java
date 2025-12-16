package com.example.demo.shared.security.customer;

import com.example.demo.shared.exception.ApplicationLayerException;
import com.example.demo.shared.jwt.AuthPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CustomerAuthContext {

  private CustomerAuthContext() {}

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

  public static String getCurrentUserId() {
    return getCurrentPrincipal().userId();
  }

  public static String getCurrentEmail() {
    return getCurrentPrincipal().email();
  }
}
