"use client";

import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import type { Book } from "@/types/book";

interface DeleteBookDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteBookDialog({
  book,
  open,
  onOpenChange,
  onDeleted,
}: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!book) return;

    setIsDeleting(true);
    try {
      await adminService.deleteBook(book.id);
      toast.success("Livre supprimé avec succès");
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Supprimer le livre</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-medium text-foreground">
            &ldquo;{book?.title}&rdquo;
          </span>{" "}
          ? Cette action est irréversible.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="gap-2"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Supprimer
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
