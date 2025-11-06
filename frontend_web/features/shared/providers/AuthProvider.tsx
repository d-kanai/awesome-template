"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/features/auth/actions/getSession";

/**
 * AuthProvider
 * - Server Componentsからセッション情報を受け取る
 * - httpOnly Cookie認証を使用（localStorageは使用しない）
 * - セッション情報をReact Contextで提供
 *
 * Note: サインイン/サインアウトはServer Actionsを直接使用
 * - signinAction: features/auth/actions/signin.ts
 * - signoutAction: features/auth/actions/signout.ts
 */

type AuthContextType = Session;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
