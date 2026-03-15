import { api } from "./api";
import { AuthResponse, User } from "@/types/user";
import { ApiResponse } from "@/types/api";

export interface LoginInput {
  email: string;
  password?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
}

export const authService = {
  login: (data: LoginInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),
    
  register: (data: RegisterInput) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),
};
