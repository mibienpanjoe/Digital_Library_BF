import { Book } from "@/types/book";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        Aucun livre trouvé.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
