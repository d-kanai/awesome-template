import { useFlag } from "@unleash/proxy-client-react";

import type { FeatureFlagName } from "@/features/shared/constants/featureFlags";

/**
 * Custom hook to check if a feature flag is enabled.
 * This is a thin wrapper around Unleash's useFlag hook for consistency with other hooks.
 *
 * @param flagName - The name of the feature flag to check (must be defined in FEATURE_FLAGS)
 * @returns true if the feature flag is enabled, false otherwise
 *
 * @example
 * ```tsx
 * import { FEATURE_FLAGS } from "@/features/shared/constants/featureFlags";
 *
 * function MyComponent() {
 *   const showVersionInfo = useFeatureFlag(FEATURE_FLAGS.SHOW_VERSION_INFO);
 *
 *   return (
 *     <View>
 *       {showVersionInfo && <VersionInfo />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useFeatureFlag(flagName: FeatureFlagName): boolean {
  return useFlag(flagName);
}
