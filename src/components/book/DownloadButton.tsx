"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
// import { bookService } from "@/services/book.service";
import { toast } from "sonner";
import { formatFileSize } from "@/lib/format";
import { Book } from "@/types/book";

interface DownloadButtonProps {
  book: Book;
  className?: string;
}

export function DownloadButton({ book, className }: DownloadButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setIsDownloading(true);
      // const blob = await bookService.download(book.id);
      
      // Simulate download for now since we don't have the API wired up
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Blob
      const blob = new Blob(["mock content"], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title}.${book.fileFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Téléchargement réussi");
    } catch (error) {
      toast.error("Échec du téléchargement. Veuillez réessayer.");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        className={className}
        onClick={() => router.push("/login")}
      >
        Se connecter pour télécharger
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading}
      className={className}
    >
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Télécharger ({formatFileSize(book.fileSize)})
    </Button>
  );
}
