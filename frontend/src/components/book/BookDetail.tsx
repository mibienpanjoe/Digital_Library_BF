import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "./DownloadButton";
import { formatDate, formatFileSize } from "@/lib/utils";
import { Calendar, FileText, HardDrive, Download } from "lucide-react";
import type { Book } from "@/types/book";

interface BookDetailProps {
  book: Book;
}

export function BookDetail({ book }: BookDetailProps) {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted md:w-72">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 288px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/30">
              {book.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {book.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{book.author}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs uppercase">
            {book.fileFormat}
          </Badge>
          {book.category && (
            <Badge variant="outline" className="text-xs">
              {book.category}
            </Badge>
          )}
        </div>

        <p className="mt-6 text-base leading-7 text-muted-foreground">
          {book.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{book.fileFormat.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>{formatFileSize(book.fileSize)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{book.downloadCount} téléchargements</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(book.createdAt)}</span>
          </div>
        </div>

        <div className="mt-8">
          <DownloadButton bookId={book.id} bookTitle={book.title} />
        </div>
      </div>
    </div>
  );
}
