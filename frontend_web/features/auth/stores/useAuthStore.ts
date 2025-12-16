import { create } from "zustand";

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  // OTPフロー用
  otpSent: boolean;
  pendingEmail: string | null;
  error: string | null;
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setAuthenticated: (user: AuthUser, accessToken: string) => void;
  // OTPフロー用
  setOtpSent: (email: string) => void;
  resetOtpFlow: () => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  otpSent: false,
  pendingEmail: null,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setAuthenticated: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
      otpSent: false,
      pendingEmail: null,
      error: null,
    }),

  setOtpSent: (email) =>
    set({
      otpSent: true,
      pendingEmail: email,
      isLoading: false,
      error: null,
    }),

  resetOtpFlow: () =>
    set({
      otpSent: false,
      pendingEmail: null,
      error: null,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      otpSent: false,
      pendingEmail: null,
      error: null,
    }),

  clearError: () => set({ error: null }),
}));
