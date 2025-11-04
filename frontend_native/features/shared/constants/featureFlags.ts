/**
 * Feature flag names used in the application.
 * These must match the flag names configured in Unleash.
 */
export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
  // Add more feature flags here as they are created
  // EXAMPLE_NEW_UI: "new-ui-design",
  // EXAMPLE_PREMIUM_FEATURE: "premium-feature",
} as const;

/**
 * Type representing all available feature flag names.
 */
export type FeatureFlagName =
  (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
