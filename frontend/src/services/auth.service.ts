import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginInput, RegisterInput } from "@/types/user";

export const authService = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data;
  },
};
