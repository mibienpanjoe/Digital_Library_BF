import api from "./api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Book, BookFilters } from "@/types/book";

export const bookService = {
  async getAll(params?: BookFilters): Promise<PaginatedResponse<Book>> {
    return api.get<PaginatedResponse<Book>>("/books", params as Record<string, string | number | undefined>);
  },

  async getById(id: string): Promise<Book> {
    const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data;
  },

  async download(id: string): Promise<Blob> {
    return api.downloadBlob(`/books/${id}/download`);
  },
};
