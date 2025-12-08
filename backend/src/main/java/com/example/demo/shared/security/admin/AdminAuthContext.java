package com.example.demo.shared.security.admin;

import com.example.demo.shared.exception.ApplicationLayerException;
import com.example.demo.shared.jwt.JwtClaims;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AdminAuthContext {

  private AdminAuthContext() {}

  public static JwtClaims getCurrentClaims() {
    final var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      throw new ApplicationLayerException("Authentication required");
    }
    if (!(authentication.getPrincipal() instanceof JwtClaims claims)) {
      throw new ApplicationLayerException("Invalid authentication principal");
    }
    return claims;
  }

  public static String getCurrentAdminId() {
    return getCurrentClaims().userId();
  }

  public static String getCurrentEmail() {
    return getCurrentClaims().email();
  }
}
