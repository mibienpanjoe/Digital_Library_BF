"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DownloadButton } from "@/components/book/DownloadButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "@/types/book";
import { formatFileSize, formatDate } from "@/lib/format";
import { Calendar, User, FileText, Download } from "lucide-react";
import { bookService } from "@/services/book.service";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        if (id && typeof id === "string") {
          const response = await bookService.getById(id);
          // Assuming ApiResponse format with data: Book
          setBook(response.data || (response as any));
        }
      } catch (error) {
        console.error("Failed to fetch book", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2 py-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!book) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold">Livre non trouvé</h2>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Cover Image */}
          <div className="relative aspect-[3/4] w-full bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <span>Pas de couverture</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 flex flex-col">
            <div className="mb-6">
              {book.category && <Badge className="mb-2 uppercase tracking-wide">{book.category}</Badge>}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {book.title}
              </h1>
              <div className="flex items-center text-lg text-slate-600 dark:text-slate-400">
                <User className="mr-2 h-5 w-5" />
                {book.author}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold">Format</span>
                <span className="font-medium flex items-center mt-1 uppercase">
                  <FileText className="mr-1.5 h-4 w-4" /> {book.fileFormat}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold">Taille</span>
                <span className="font-medium mt-1">{formatFileSize(book.fileSize)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold">Ajouté le</span>
                <span className="font-medium flex items-center mt-1">
                  <Calendar className="mr-1.5 h-4 w-4" /> {formatDate(book.createdAt)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold">Téléchargements</span>
                <span className="font-medium flex items-center mt-1 text-primary">
                  <Download className="mr-1.5 h-4 w-4" /> {book.downloadCount}
                </span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="mt-auto">
              <DownloadButton book={book} className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
