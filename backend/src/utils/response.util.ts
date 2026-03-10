import { ApiResponse, PaginationMeta } from "../types/response.types";

/**
 * Formate une réponse de succès au format API standard.
 */
export function successResponse<T>(
  data: T,
  message?: string,
  pagination?: PaginationMeta,
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
}

/**
 * Formate une réponse d'erreur au format API standard.
 */
export function errorResponse(code: string, message: string): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}
