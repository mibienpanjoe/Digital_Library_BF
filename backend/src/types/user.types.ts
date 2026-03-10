export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export interface UserWithDownloadCount extends User {
  downloadCount: number;
}
