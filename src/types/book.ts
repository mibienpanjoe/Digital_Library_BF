export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  fileFormat: "pdf" | "epub";
  fileSize: number;
  category?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}
