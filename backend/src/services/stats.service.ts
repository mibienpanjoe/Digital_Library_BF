import { supabaseAdmin } from "../config/supabase";
import { DashboardStats } from "../types/response.types";

export const statsService = {
  /**
   * Statistiques agrégées du dashboard admin.
   * Retourne : totalBooks, totalUsers, totalDownloads, recentDownloads
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // Total livres
    const { count: totalBooks } = await supabaseAdmin
      .from("books")
      .select("id", { count: "exact", head: true });

    // Total utilisateurs
    const { count: totalUsers } = await supabaseAdmin
      .from("users")
      .select("id", { count: "exact", head: true });

    // Total téléchargements
    const { count: totalDownloads } = await supabaseAdmin
      .from("downloads")
      .select("id", { count: "exact", head: true });

    // Derniers téléchargements (10 plus récents)
    const { data: recentData } = await supabaseAdmin
      .from("downloads")
      .select(
        "id, downloaded_at, users!inner(id, name), books!inner(id, title)",
      )
      .order("downloaded_at", { ascending: false })
      .limit(10);

    const recentDownloads = (recentData || []).map(
      (row: Record<string, unknown>) => {
        const userData = row.users as Record<string, unknown>;
        const bookData = row.books as Record<string, unknown>;
        return {
          id: row.id as string,
          user: {
            id: userData.id as string,
            name: userData.name as string,
          },
          book: {
            id: bookData.id as string,
            title: bookData.title as string,
          },
          downloadedAt: row.downloaded_at as string,
        };
      },
    );

    return {
      totalBooks: totalBooks || 0,
      totalUsers: totalUsers || 0,
      totalDownloads: totalDownloads || 0,
      recentDownloads,
    };
  },
};
