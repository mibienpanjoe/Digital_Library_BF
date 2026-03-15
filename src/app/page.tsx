"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BookGrid } from "@/components/book/BookGrid";
import { BookGridSkeleton } from "@/components/shared/Skeleton";
import { bookService } from "@/services/book.service";
import { Book } from "@/types/book";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await bookService.getAll();
        // Assuming ApiResponse format with data: PaginatedResponse<Book>
        if (response.data && Array.isArray(response.data.data)) {
           setBooks(response.data.data);
        } else if (Array.isArray(response.data)) {
           setBooks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PublicLayout>
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Catalogue
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Découvrez nos ressources disponibles en téléchargement.
            </p>
          </div>
          <div className="w-full md:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher un livre..."
              className="pl-10 rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <BookGridSkeleton count={10} />
        ) : filteredBooks.length > 0 ? (
          <BookGrid books={filteredBooks} />
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500">Aucun livre trouvé.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
