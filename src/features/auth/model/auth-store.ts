import type { User } from "@/entities/user";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthChecked: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setAuthChecked: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthChecked: false,
  isLoading: false,

  setUser: (user) => set({ user }),

  setAuthChecked: (value) => set({ isAuthChecked: value }),

  setLoading: (value) => set({ isLoading: value }),

  logout: () =>
    set({
      user: null,
      isAuthChecked: true,
      isLoading: false,
    }),
}));
