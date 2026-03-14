import { api } from "./api";
import { Book } from "@/types/book";
import { User } from "@/types/user";
import { ApiResponse, PaginatedResponse, PaginationInfo } from "@/types/api";

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalDownloads: number;
  monthlyDownloads: { date: string; count: number }[];
}

export const adminService = {
  getDashboardStats: () =>
    api.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats"),
    
  createBook: (data: FormData) =>
    api.upload<ApiResponse<Book>>("/admin/books", data),
    
  updateBook: (id: string, data: FormData) =>
    api.upload<ApiResponse<Book>>(`/admin/books/${id}`, data),
    
  deleteBook: (id: string) =>
    api.delete<ApiResponse<void>>(`/admin/books/${id}`),
    
  getUsers: (params?: PaginationInfo) =>
    api.get<ApiResponse<PaginatedResponse<User>>>("/admin/users", params),
};
