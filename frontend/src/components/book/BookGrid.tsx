import { BookCard } from "./BookCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Book } from "@/types/book";

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
