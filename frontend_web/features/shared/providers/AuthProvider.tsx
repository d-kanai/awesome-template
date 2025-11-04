"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * AuthProvider
 * JWTトークンをlocalStorageで管理
 */

const TOKEN_KEY = "auth_token";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // アプリ起動時に認証状態をチェック
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const signIn = useCallback((token: string) => {
    // サインイン成功時にトークンを保存
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    // トークンを削除
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
