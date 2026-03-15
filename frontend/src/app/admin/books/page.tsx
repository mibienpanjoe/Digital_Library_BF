"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { BookTable } from "@/components/admin/BookTable";
import { DeleteBookDialog } from "@/components/admin/DeleteBookDialog";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Search } from "lucide-react";
import { bookService } from "@/services/book.service";
import type { Book } from "@/types/book";
import Link from "next/link";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await bookService.getAll({ page, limit: 20, search: debouncedSearch });
      setBooks(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = (book: Book) => {
    setDeleteBook(book);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des livres
          </h1>
          <p className="text-sm text-muted-foreground">
            Gérez les livres du catalogue
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/upload">
            <Plus className="h-4 w-4" />
            Ajouter
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Livres
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchBooks} />
          ) : books.length === 0 ? (
            <EmptyState
              title="Aucun livre"
              description="Aucun livre trouvé. Ajoutez votre premier livre !"
            />
          ) : (
            <>
              <BookTable
                books={books}
                onDelete={handleDelete}
              />
              <div className="mt-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteBookDialog
        book={deleteBook}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={fetchBooks}
      />
    </div>
  );
}
