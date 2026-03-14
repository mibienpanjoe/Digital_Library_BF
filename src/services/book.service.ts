import { api } from "./api";
import { Book, BookFilters } from "@/types/book";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export const bookService = {
  getAll: (params?: BookFilters) =>
    api.get<ApiResponse<PaginatedResponse<Book>>>("/books", params),
    
  getById: (id: string) =>
    api.get<ApiResponse<Book>>(`/books/${id}`),
    
  download: (id: string) =>
    api.get<Blob>(`/books/${id}/download`),
};
