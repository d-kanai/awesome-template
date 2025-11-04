import { useFlag } from "@unleash/proxy-client-react";

/**
 * Custom hook to check if a feature flag is enabled.
 * This is a thin wrapper around Unleash's useFlag hook for consistency with other hooks.
 *
 * @param flagName - The name of the feature flag to check
 * @returns true if the feature flag is enabled, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isNewFeatureEnabled = useFeatureFlag('new-feature');
 *
 *   return (
 *     <View>
 *       {isNewFeatureEnabled ? <NewFeature /> : <OldFeature />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useFeatureFlag(flagName: string): boolean {
  return useFlag(flagName);
}
