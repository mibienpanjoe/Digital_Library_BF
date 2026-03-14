import api from "./api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Book } from "@/types/book";
import type { User } from "@/types/user";
import type { Download, DashboardStats } from "@/types/download";

export const adminService = {
  async createBook(formData: FormData): Promise<Book> {
    const response = await api.upload<ApiResponse<Book>>(
      "/admin/books",
      formData
    );
    return response.data;
  },

  async updateBook(id: string, formData: FormData): Promise<Book> {
    const response = await api.uploadPut<ApiResponse<Book>>(
      `/admin/books/${id}`,
      formData
    );
    return response.data;
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/books/${id}`);
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    return api.get<PaginatedResponse<User>>("/admin/users", params as Record<string, string | number | undefined>);
  },

  async getUserDownloads(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Download>> {
    return api.get<PaginatedResponse<Download>>(
      `/admin/users/${userId}/downloads`,
      params as Record<string, string | number | undefined>
    );
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard/stats"
    );
    return response.data;
  },
};
