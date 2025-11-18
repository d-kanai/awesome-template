import { create } from "zustand";

interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: { id: string; email: string } | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
