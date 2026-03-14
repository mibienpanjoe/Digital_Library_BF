"use client";

import { useState, useEffect, useCallback } from "react";
import type { Book, BookFilters } from "@/types/book";
import { bookService } from "@/services/book.service";
import { ITEMS_PER_PAGE } from "@/lib/constants";

interface UseBooksReturn {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  setPage: (page: number) => void;
  setFilters: (filters: BookFilters | ((prev: BookFilters) => BookFilters)) => void;
  refresh: () => void;
}

export function useBooks(initialFilters?: BookFilters): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialFilters?.page || 1);
  const [filters, setFilters] = useState<BookFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookService.getAll({
        ...filters,
        page,
        limit: filters.limit || ITEMS_PER_PAGE,
      });
      setBooks(response.data);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        total: response.pagination.total,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    isLoading,
    error,
    pagination,
    setPage,
    setFilters,
    refresh: fetchBooks,
  };
}
