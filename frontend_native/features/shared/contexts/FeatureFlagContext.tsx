import { FlagProvider } from "@unleash/proxy-client-react";
import type React from "react";

import { unleashConfig } from "@/features/shared/api/featureFlagClient";

interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

/**
 * Feature flag provider component that wraps the application with Unleash context.
 * This enables feature flag usage throughout the app via the useFeatureFlag hook.
 */
export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  return <FlagProvider config={unleashConfig}>{children}</FlagProvider>;
}
