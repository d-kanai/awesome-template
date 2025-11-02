import * as Linking from "expo-linking";
import { router } from "expo-router";
import type React from "react";
import { createContext, useEffect, useState } from "react";

import { tokenManager } from "@/features/shared/api/fetcher";
import { tokenStorage } from "@/features/shared/storage/tokenStorage";

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up token getter for API fetcher
  useEffect(() => {
    tokenManager.setGetter(() => accessToken);
  }, [accessToken]);

  // Initialize: Load token from SecureStore on app startup
  useEffect(() => {
    async function initialize() {
      try {
        // E2Eテストモード: launch argumentsをチェック
        if (__DEV__) {
          const initialUrl = await Linking.getInitialURL();
          const globalWithE2E = global as typeof global & {
            __E2E_MODE__?: boolean;
          };
          const isE2EMode =
            initialUrl?.includes("-E2E_MODE") ||
            globalWithE2E.__E2E_MODE__ === true;

          if (isE2EMode) {
            try {
              const apiBaseUrl =
                process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080";
              const response = await fetch(`${apiBaseUrl}/test/token`, {
                method: "POST",
              });
              if (response.ok) {
                const data = await response.json();
                if (data.token) {
                  await tokenStorage.setToken(data.token);
                  console.log("[E2E] Test token set successfully");
                }
              }
            } catch (e) {
              console.warn("[E2E] Failed to set test token:", e);
            }
          }
        }

        const token = await tokenStorage.getToken();
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  const signIn = async (token: string) => {
    await tokenStorage.setToken(token);
    setAccessToken(token);
  };

  const signOut = async () => {
    await tokenStorage.removeToken();
    setAccessToken(null);
    router.replace("/");
  };

  const value: AuthContextType = {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
