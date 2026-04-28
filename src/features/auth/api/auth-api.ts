import type { User } from "@/entities/user";
import { api } from "@/shared";

export type AuthRequest = {
  userName: string;
  password: string;
};

export const authApi = {
  signIn(data: AuthRequest) {
    return api.post<User>("/subsystem/signin", data);
  },
  signUp(data: AuthRequest) {
    return api.post<User>("/subsystem/signup", data);
  },
  me() {
    return api.get<User>("/subsystem/me");
  },

  logout() {
    return api.post<void>("/subsystem/logout");
  },
};
