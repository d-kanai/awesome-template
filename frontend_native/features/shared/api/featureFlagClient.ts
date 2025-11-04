import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IConfig } from "@unleash/proxy-client-react";

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Unleash Proxy Client configuration
 *
 * Performance considerations:
 * - refreshInterval: Lower values = more real-time updates but higher server load
 * - Production recommendation: 60-300 seconds (1-5 minutes)
 * - Development: 15-30 seconds for faster testing
 * - Consider: User count × (60 / refreshInterval) = requests per minute
 */
export const unleashConfig: IConfig = {
  url: `${apiBaseUrl}/featureflags/proxy`,
  clientKey: "proxy", // Not used in our custom proxy, but required by SDK
  refreshInterval: 3, // Polling interval in seconds (development: very fast updates)
  appName: "awesome-template-native",
  environment: "development",
  storageProvider: {
    save: async (name: string, data: unknown) => {
      await AsyncStorage.setItem(name, JSON.stringify(data));
    },
    get: async (name: string) => {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : undefined;
    },
  },
};
