import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <div className="group rounded-xl border border-border bg-card transition-shadow duration-150 ease-in-out hover:shadow-md">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl bg-muted">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-150 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {book.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-lg font-semibold leading-tight tracking-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs uppercase">
              {book.fileFormat}
            </Badge>
            {book.category && (
              <Badge variant="outline" className="text-xs">
                {book.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
