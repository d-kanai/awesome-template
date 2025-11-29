// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Button IDs (for click event logging)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SigninButtonIds = {
  submit: "auth-signin-submit-button",
} as const;

export const SignupButtonIds = {
  submit: "auth-signup-submit-button",
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test IDs (for non-button elements)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SigninTestIds = {
  emailInput: "signin-email",
  passwordInput: "signin-password",
  submitButton: "signin-submit",
  signupLink: "signin-signup-link",
  errorMessage: "signin-error",
} as const;

export const SignupTestIds = {
  emailInput: "signup-email",
  passwordInput: "signup-password",
  submitButton: "signup-submit",
  signinLink: "signup-signin-link",
  errorMessage: "signup-error",
} as const;
