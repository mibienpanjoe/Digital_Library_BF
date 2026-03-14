export interface Download {
    id: string
    user_id: string
    book_id: string
    downloaded_at: string
    book?: {
        title: string
        author: string
    }
}