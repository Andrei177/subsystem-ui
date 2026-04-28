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
      "rounded-md px-4 py-2 text-base font-medium transition-colors",
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
        toast.error("Произошла ошибка при выходе из акканута");
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <header className="w-full border-b bg-background">
      <NavigationMenu className="max-w-none justify-start">
        <NavigationMenuList className="flex w-screen items-center gap-3 px-6 py-4">
          <NavigationMenuItem className="mr-8 flex flex-col">
            <span className="text-lg font-semibold leading-none">
              {user?.userName ?? "Пользователь"}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              {user?.role ?? "Не авторизован"}
            </span>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to={Routes.CONTRACT_REQUEST}
                className={linkClassName(Routes.CONTRACT_REQUEST)}
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
                  to={Routes.ADMIN_REQUESTS}
                  className={linkClassName(Routes.ADMIN_REQUESTS)}
                >
                  Одобрение заявок
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem className="ml-auto">
            <Button
              onClick={handleLogout}
              className="cursor-pointer rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              {isLoading ? "Выходим..." : "Выйти"}
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
