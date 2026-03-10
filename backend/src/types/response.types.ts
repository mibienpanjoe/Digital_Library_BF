export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface BookFilters extends PaginationQuery {
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface UserFilters extends PaginationQuery {
  search?: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalDownloads: number;
  recentDownloads: Array<{
    id: string;
    user: { id: string; name: string };
    book: { id: string; title: string };
    downloadedAt: string;
  }>;
}
