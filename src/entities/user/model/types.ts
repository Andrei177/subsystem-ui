export type UserRole = "SUPER_ADMIN" | "ADMIN" | "REPRESENTATIVE";

export type User = {
  userId: number;
  userName: string;
  role: UserRole;
};
