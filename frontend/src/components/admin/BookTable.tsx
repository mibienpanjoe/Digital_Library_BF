"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { Book } from "@/types/book";

interface BookTableProps {
  books: Book[];
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

export function BookTable({ books, onEdit, onDelete }: BookTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Auteur</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Format</TableHead>
          <TableHead>Taille</TableHead>
          <TableHead>Téléchargements</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell className="max-w-[200px] font-medium">
              <span className="line-clamp-1">{book.title}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {book.author}
            </TableCell>
            <TableCell>
              {book.category && (
                <Badge variant="outline" className="text-xs">
                  {book.category}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs uppercase">
                {book.fileFormat}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatFileSize(book.fileSize)}
            </TableCell>
            <TableCell>{book.downloadCount}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(book.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(book)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(book)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
