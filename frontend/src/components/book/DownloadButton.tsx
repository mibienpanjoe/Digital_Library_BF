"use client";

import { useState } from "react";
import { Download, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/AuthProvider";
import { bookService } from "@/services/book.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DownloadButtonProps {
  bookId: string;
  bookTitle: string;
}

export function DownloadButton({ bookId, bookTitle }: DownloadButtonProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await bookService.download(bookId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bookTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Téléchargement démarré !");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors du téléchargement"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button variant="outline" onClick={() => router.push("/login")} className="gap-2">
        <LogIn className="h-4 w-4" />
        Se connecter pour télécharger
      </Button>
    );
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} className="gap-2">
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isDownloading ? "Téléchargement..." : "Télécharger"}
    </Button>
  );
}
