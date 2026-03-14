import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <Card className="overflow-hidden bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-150 rounded-xl h-full flex flex-col">
        <div className="relative aspect-[3/4] w-full bg-slate-200 dark:bg-slate-700">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Couverture de ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <span className="text-sm">Pas de couverture</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 text-slate-900 dark:text-slate-50 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {book.author}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-wider">
              {book.fileFormat}
            </Badge>
            {book.category && (
              <Badge variant="outline" className="text-[10px]">
                {book.category}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
