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
        // 開発環境: test token APIからトークンを取得して保存
        if (__DEV__) {
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
                console.log("[DEV] Test token set successfully");
              }
            }
          } catch (e) {
            console.warn("[DEV] Failed to set test token:", e);
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
