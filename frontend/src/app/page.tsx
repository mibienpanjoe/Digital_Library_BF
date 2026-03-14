"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookGrid } from "@/components/book/BookGrid";
import { BookSearch } from "@/components/book/BookSearch";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/ErrorState";
import { BookGridSkeleton } from "@/components/shared/Skeleton";
import { useBooks } from "@/hooks/useBooks";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  const {
    books,
    isLoading,
    error,
    pagination,
    setPage,
    setFilters,
    refresh,
  } = useBooks();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4" />
              Bibliothèque Numérique
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Découvrez le savoir
              <br />
              <span className="text-primary">du Burkina Faso</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg leading-7">
              Explorez notre collection de livres et documents numériques.
              Téléchargez gratuitement des ouvrages en histoire, littérature,
              sciences et bien plus.
            </p>
          </div>
        </section>

        {/* Catalogue */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <BookSearch
              onSearch={(search) =>
                setFilters((prev) => ({ ...prev, search, page: 1 }))
              }
              onCategoryChange={(category) =>
                setFilters((prev) => ({ ...prev, category, page: 1 }))
              }
            />
          </div>

          {isLoading ? (
            <BookGridSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {pagination.total} livre{pagination.total > 1 ? "s" : ""}{" "}
                trouvé{pagination.total > 1 ? "s" : ""}
              </div>
              <BookGrid books={books} />
              <div className="mt-8">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
