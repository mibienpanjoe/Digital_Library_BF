"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { BookGrid } from "@/components/book/BookGrid";
import { BookGridSkeleton } from "@/components/shared/Skeleton";
// import { bookService } from "@/services/book.service";
import { Book } from "@/types/book";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock Data to verify UI since API might not be running yet
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "Histoire du Burkina Faso",
    author: "Jean-Baptiste Kiéthéga",
    description: "Une exploration détaillée de l'histoire...",
    fileFormat: "pdf",
    fileSize: 2500000,
    category: "Histoire",
    downloadCount: 154,
    createdAt: "2024-01-01T12:00:00.000Z",
    updatedAt: "2024-01-01T12:00:00.000Z",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "2",
    title: "Contes de la Savane",
    author: "Amadou Hampâté Bâ",
    description: "Recueil de contes traditionnels de la savane africaine.",
    fileFormat: "epub",
    fileSize: 1200000,
    category: "Contes",
    downloadCount: 89,
    createdAt: "2024-01-10T09:30:00.000Z",
    updatedAt: "2024-01-10T09:30:00.000Z",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "3",
    title: "Le Droit Foncier Burkinabè",
    author: "Ouvrage Collectif",
    description: "Analyse des lois foncières au Burkina Faso.",
    fileFormat: "pdf",
    fileSize: 4500000,
    category: "Droit",
    downloadCount: 42,
    createdAt: "2024-02-05T15:45:00.000Z",
    updatedAt: "2024-02-05T15:45:00.000Z"
  }
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulated API call 
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        // In a real scenario:
        // const response = await bookService.getAll();
        // setBooks(response.data.data);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setBooks(MOCK_BOOKS);
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
        ) : (
          <BookGrid books={filteredBooks} />
        )}
      </div>
    </PublicLayout>
  );
}
