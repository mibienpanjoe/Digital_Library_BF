import { api } from "./api";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const profileService = {
  getProfile: () =>
    api.get<ApiResponse<User>>("/profile"),
    
  updateProfile: (data: any) =>
    api.put<ApiResponse<User>>("/profile", data),
    
  updatePassword: (data: any) =>
    api.put<ApiResponse<void>>("/profile/password", data),
};
