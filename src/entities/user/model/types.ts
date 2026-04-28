export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type User = {
  userId: number;
  userName: string;
  role: UserRole;
};
