export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  downloadCount?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}
