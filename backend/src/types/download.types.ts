export interface Download {
  id: string;
  userId: string;
  bookId: string;
  downloadedAt: string;
}

export interface DownloadWithBook {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  downloadedAt: string;
}

export interface RecentDownload {
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
}
