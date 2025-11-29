import { create } from "zustand";
import { env } from "@/features/shared/lib/env";

/**
 * 機能フラグの定数
 */
export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

interface FeatureFlagState {
  flags: Record<string, boolean>;
  isLoading: boolean;
  error: Error | null;
}

interface FeatureFlagActions {
  fetchFlags: () => Promise<void>;
  getFlag: (flagName: string) => boolean;
}

interface UnleashToggle {
  name: string;
  enabled: boolean;
}

/**
 * Fetch feature flags from API
 */
async function fetchFeatureFlagsFromApi(): Promise<Record<string, boolean>> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}/featureflags/proxy`,
    { headers: { Authorization: "proxy" } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch feature flags: ${response.status}`);
  }

  const data = await response.json();
  return parseToggles(data.toggles);
}

/**
 * Parse Unleash toggles to flags record
 */
function parseToggles(toggles: unknown): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  if (!Array.isArray(toggles)) {
    return flags;
  }
  for (const toggle of toggles as UnleashToggle[]) {
    flags[toggle.name] = toggle.enabled;
  }
  return flags;
}

/**
 * Convert error to Error instance
 */
function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Unknown error");
}

export const useFeatureFlagStore = create<
  FeatureFlagState & FeatureFlagActions
>((set, get) => ({
  flags: {},
  isLoading: false,
  error: null,

  fetchFlags: async () => {
    set({ isLoading: true, error: null });
    try {
      const flags = await fetchFeatureFlagsFromApi();
      set({ flags, isLoading: false });
    } catch (error) {
      set({ error: toError(error), isLoading: false });
    }
  },

  getFlag: (flagName: string) => {
    return get().flags[flagName] ?? false;
  },
}));
