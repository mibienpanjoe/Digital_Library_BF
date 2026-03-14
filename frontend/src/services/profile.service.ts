import api from "./api";
import type { ApiResponse } from "@/types/api";
import type { User, ProfileUpdate, PasswordUpdate } from "@/types/user";

export const profileService = {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/profile");
    return response.data;
  },

  async updateProfile(data: ProfileUpdate): Promise<User> {
    const response = await api.put<ApiResponse<User>>("/profile", data);
    return response.data;
  },

  async updatePassword(data: PasswordUpdate): Promise<void> {
    await api.put<ApiResponse<null>>("/profile/password", data);
  },
};
