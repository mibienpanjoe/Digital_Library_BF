export type FileFormat = "pdf" | "epub";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string | null;
  fileUrl: string;
  fileFormat: FileFormat;
  fileSize: number;
  category: string | null;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookCreate {
  title: string;
  author: string;
  description: string;
  category?: string;
}

export interface BookUpdate {
  title?: string;
  author?: string;
  description?: string;
  category?: string;
}

/**
 * Représentation d'un livre dans une liste (catalogue public).
 * Exclut fileUrl et fileSize pour la liste.
 */
export interface BookListItem {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string | null;
  category: string | null;
  fileFormat: FileFormat;
  createdAt: string;
}
