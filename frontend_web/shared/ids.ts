// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Button IDs (for click event logging)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ThemeToggleButtonIds = {
  toggle: "shared-theme-toggle-button",
} as const;

export const HeaderAuthButtonIds = {
  signIn: "shared-header-auth-signin-button",
  register: "shared-header-auth-register-button",
} as const;

export const ErrorBoundaryButtonIds = {
  retry: "shared-error-boundary-retry-button",
  goHome: "shared-error-boundary-go-home-button",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test IDs (for non-button elements)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SharedTestIds = {
  textFieldError: "text-field-error",
} as const;
