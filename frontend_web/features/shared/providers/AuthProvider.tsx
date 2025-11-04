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
 * httpOnly Cookie認証を使用するため、フロントエンドではトークンを保持しない
 * 認証状態のみを管理
 */

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
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
      // TODO: バックエンドに認証状態を確認するエンドポイント実装後、ここで呼び出す
      // 現在はCookieが存在するかチェックできないため、とりあえずfalseに設定
      setIsAuthenticated(false);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(() => {
    // サインイン成功時に呼び出される
    // Cookieはバックエンドで設定されているため、ここでは状態を更新するのみ
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    // TODO: バックエンドにサインアウトエンドポイント実装後、ここで呼び出す
    // Cookieを削除するためにバックエンドを呼び出す
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
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
