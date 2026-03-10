import { supabaseAdmin } from "../config/supabase";
import { NotFoundError } from "../utils/errors.util";
import { UserWithDownloadCount } from "../types/user.types";
import { DownloadWithBook } from "../types/download.types";
import { UserFilters, PaginationMeta } from "../types/response.types";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.util";

export const userService = {
  /**
   * Liste paginée des utilisateurs avec compteur de téléchargements.
   */
  async getAll(
    filters: UserFilters,
  ): Promise<{ data: UserWithDownloadCount[]; pagination: PaginationMeta }> {
    const { page, limit, offset } = parsePagination(filters);

    // Requête de base
    let query = supabaseAdmin
      .from("users")
      .select("id, name, email, role, created_at", { count: "exact" });

    // Recherche par nom ou email
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
      );
    }

    // Pagination
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs : ${error.message}`);
    }

    // Pour chaque utilisateur, compter les téléchargements
    const users: UserWithDownloadCount[] = await Promise.all(
      (data || []).map(async (user: Record<string, unknown>) => {
        const { count: dlCount } = await supabaseAdmin
          .from("downloads")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        return {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
          role: user.role as "user" | "admin",
          createdAt: user.created_at as string,
          downloadCount: dlCount || 0,
        };
      }),
    );

    const pagination = buildPaginationMeta(count || 0, page, limit);

    return { data: users, pagination };
  },

  /**
   * Historique des téléchargements d'un utilisateur.
   */
  async getDownloads(
    userId: string,
    filters: { page?: number; limit?: number },
  ): Promise<{ data: DownloadWithBook[]; pagination: PaginationMeta }> {
    // Vérifier que l'utilisateur existe
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      throw new NotFoundError(
        "USER_NOT_FOUND",
        "Utilisateur introuvable",
      );
    }

    const { page, limit, offset } = parsePagination(filters);

    const { data, count, error } = await supabaseAdmin
      .from("downloads")
      .select(
        "id, downloaded_at, books!inner(id, title, author)",
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("downloaded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Erreur lors de la récupération des téléchargements : ${error.message}`);
    }

    const downloads: DownloadWithBook[] = (data || []).map(
      (row: Record<string, unknown>) => {
        const bookData = row.books as Record<string, unknown>;
        return {
          id: row.id as string,
          book: {
            id: bookData.id as string,
            title: bookData.title as string,
            author: bookData.author as string,
          },
          downloadedAt: row.downloaded_at as string,
        };
      },
    );

    const pagination = buildPaginationMeta(count || 0, page, limit);

    return { data: downloads, pagination };
  },
};
