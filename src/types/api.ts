export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
