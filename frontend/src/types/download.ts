export interface Download {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  downloadedAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalDownloads: number;
  recentDownloads: {
    id: string;
    user: {
      id: string;
      name: string;
    };
    book: {
      id: string;
      title: string;
    };
    downloadedAt: string;
  }[];
}