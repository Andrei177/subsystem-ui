import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/model/auth-store";
import type { UserRole } from "@/entities/user/model/types";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  forbiddenRedirectTo?: string;
};

export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/signin",
  forbiddenRedirectTo = "/",
}: ProtectedRouteProps) {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (!isAuthChecked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Проверка авторизации...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={forbiddenRedirectTo} replace />;
  }

  return <Outlet />;
}
