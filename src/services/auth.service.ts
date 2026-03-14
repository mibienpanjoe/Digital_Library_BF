import { api } from "./api";
import { AuthResponse } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const authService = {
  login: (data: any) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),
    
  register: (data: any) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", data),
};
