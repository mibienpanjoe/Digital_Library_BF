"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Download } from "@/types/download";

interface DownloadHistoryProps {
  downloads: Download[];
}

export function DownloadHistory({ downloads }: DownloadHistoryProps) {
  if (downloads.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Aucun téléchargement
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Livre</TableHead>
          <TableHead>Auteur</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {downloads.map((download) => (
          <TableRow key={download.id}>
            <TableCell className="font-medium">
              {download.book.title}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {download.book.author}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(download.downloadedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
