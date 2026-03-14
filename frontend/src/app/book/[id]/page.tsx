"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookDetail } from "@/components/book/BookDetail";
import { ErrorState } from "@/components/shared/ErrorState";
import { DetailSkeleton } from "@/components/shared/Skeleton";
import { bookService } from "@/services/book.service";
import type { Book } from "@/types/book";

export default function BookPage() {
  const params = useParams();
  const id = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const data = await bookService.getById(id);
        setBook(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {isLoading ? (
            <DetailSkeleton />
          ) : error ? (
            <ErrorState message={error} />
          ) : book ? (
            <BookDetail book={book} />
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
