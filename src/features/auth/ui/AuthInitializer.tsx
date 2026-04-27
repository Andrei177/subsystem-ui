import { useEffect } from "react";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/model/auth-store";

type AuthInitializerProps = {
  children: React.ReactNode;
};

export function AuthInitializer({ children }: AuthInitializerProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);

  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);

        const response = await authApi.me();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    }

    initializeAuth();
  }, [setUser, setLoading, setAuthChecked]);

  return children;
}
