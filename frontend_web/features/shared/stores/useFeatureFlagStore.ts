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

export const useFeatureFlagStore = create<
  FeatureFlagState & FeatureFlagActions
>((set, get) => ({
  flags: {},
  isLoading: false,
  error: null,

  fetchFlags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_BASE_URL}/featureflags/proxy`,
        {
          headers: {
            Authorization: "proxy",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch feature flags: ${response.status}`);
      }

      const data = await response.json();
      const flags: Record<string, boolean> = {};

      // Unleash proxy format: { toggles: [{ name: string, enabled: boolean }] }
      if (data.toggles && Array.isArray(data.toggles)) {
        for (const toggle of data.toggles) {
          flags[toggle.name] = toggle.enabled;
        }
      }

      set({ flags, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      });
    }
  },

  getFlag: (flagName: string) => {
    return get().flags[flagName] ?? false;
  },
}));
