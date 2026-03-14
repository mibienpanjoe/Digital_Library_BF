export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  fileFormat: string;
  fileSize: number;
  downloadCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "title" | "author" | "createdAt";
  order?: "asc" | "desc";
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
