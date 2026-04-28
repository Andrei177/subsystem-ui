import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  Input,
  Routes,
} from "@/shared";
import { AuthVariants } from "../model/authVariants";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { authApi, useAuthStore } from "@/features/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  authVariant: string;
};

interface FormData {
  userName: string;
  password: string;
}

export const AuthForm = ({ authVariant }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const isSignIn = authVariant === AuthVariants.SIGNIN;
  const isSignUp = authVariant === AuthVariants.SIGNUP;

  const redirectByRole = (role: string) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      navigate(Routes.ADMIN_REQUESTS);
      return;
    }

    if (role === "USER") {
      navigate(Routes.CONTRACT_REQUEST);
      return;
    }

    navigate(Routes.SIGNIN);
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof AxiosError) {
      return (
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Ошибка авторизации"
      );
    }

    return "Произошла непредвиденная ошибка, попробуйте ещё раз";
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.userName.trim() || !formData.password.trim()) {
      toast.error("Введите имя пользователя и пароль");
      return;
    }

    setIsLoading(true);

    try {
      const res = isSignIn
        ? await authApi.signIn(formData)
        : await authApi.signUp(formData);

      setUser(res.data);
      redirectByRole(res.data.role);
    } catch (err) {
      setUser(null);
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      {isSignIn && <CardTitle className="text-center">Авторизация</CardTitle>}
      {isSignUp && <CardTitle className="text-center">Регистрация</CardTitle>}

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-100">
          <Input
            name="userName"
            placeholder="Имя пользователя"
            value={formData.userName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                userName: e.target.value,
              }))
            }
          />

          <Input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Обработка..."
              : isSignIn
                ? "Войти"
                : "Зарегистрироваться"}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        {isSignIn && (
          <p>
            Нет аккаунта? <Link to={Routes.SIGNUP}>Зарегистрироваться</Link>
          </p>
        )}

        {isSignUp && (
          <p>
            Есть аккаунт? <Link to={Routes.SIGNIN}>Войти</Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
