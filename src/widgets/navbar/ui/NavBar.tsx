import { authApi, useAuthStore } from "@/features/auth";
import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Routes,
} from "@/shared";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { toast } from "sonner";

export const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const isActive = (path: string) => location.pathname === path;

  const linkClassName = (path: string) =>
    [
      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
      "sm:px-4 sm:text-base",
      "hover:bg-accent hover:text-accent-foreground",
      isActive(path)
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground",
    ].join(" ");

  const handleLogout = () => {
    setIsLoading(true);

    authApi
      .logout()
      .then(() => {
        setUser(null);
        toast.success("Успешно вышли из аккаунта");
      })
      .catch(() => {
        toast.error("Произошла ошибка при выходе из аккаунта");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <header className="w-full overflow-x-hidden border-b bg-background">
      <div className="flex w-full max-w-full flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex min-w-0 flex-col sm:mr-6">
          <span className="truncate text-base font-semibold leading-none sm:text-lg">
            {user?.userName ?? "Пользователь"}
          </span>

          <span className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
            {user?.role ?? "Не авторизован"}
          </span>
        </div>

        <NavigationMenu className="w-full max-w-none justify-start sm:w-auto">
          <NavigationMenuList className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to={Routes.CONTRACT_REQUESTS}
                  className={linkClassName(Routes.CONTRACT_REQUESTS)}
                >
                  Заявки
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to={Routes.CONTRACT_REQUEST_CREATE}
                  className={linkClassName(Routes.CONTRACT_REQUEST_CREATE)}
                >
                  Создать заявку
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to={Routes.VIEW_REQUESTS}
                    className={linkClassName(Routes.VIEW_REQUESTS)}
                  >
                    Рассмотрение заявок
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground sm:ml-auto sm:w-auto sm:text-base"
        >
          {isLoading ? "Выходим..." : "Выйти"}
        </Button>
      </div>
    </header>
  );
};
