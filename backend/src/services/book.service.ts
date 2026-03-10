import { supabaseAdmin } from "../config/supabase";
import { env } from "../config/env";
import { NotFoundError } from "../utils/errors.util";
import { Book, BookListItem } from "../types/book.types";
import { BookFilters } from "../types/response.types";
import {
  parsePagination,
  buildPaginationMeta,
} from "../utils/pagination.util";
import { PaginationMeta } from "../types/response.types";

/**
 * Formate un enregistrement DB en objet Book.
 */
function formatBook(db: Record<string, unknown>): Book {
  return {
    id: db.id as string,
    title: db.title as string,
    author: db.author as string,
    description: db.description as string,
    coverUrl: (db.cover_url as string) || null,
    fileUrl: db.file_url as string,
    fileFormat: db.file_format as "pdf" | "epub",
    fileSize: db.file_size as number,
    category: (db.category as string) || null,
    downloadCount: (db.download_count as number) || 0,
    createdAt: db.created_at as string,
    updatedAt: db.updated_at as string,
  };
}

function formatBookListItem(db: Record<string, unknown>): BookListItem {
  return {
    id: db.id as string,
    title: db.title as string,
    author: db.author as string,
    description: db.description as string,
    coverUrl: (db.cover_url as string) || null,
    category: (db.category as string) || null,
    fileFormat: db.file_format as "pdf" | "epub",
    createdAt: db.created_at as string,
  };
}

export const bookService = {
  /**
   * Liste paginée des livres avec recherche, filtrage et tri.
   * Conformité : INV-DATA-03
   */
  async getAll(
    filters: BookFilters,
  ): Promise<{ data: BookListItem[]; pagination: PaginationMeta }> {
    const { page, limit, offset } = parsePagination(filters);
    const sortBy = filters.sortBy || "created_at";
    const order = filters.order || "desc";

    // Mapper les noms de champs API → DB
    const sortFieldMap: Record<string, string> = {
      title: "title",
      author: "author",
      createdAt: "created_at",
      created_at: "created_at",
    };
    const dbSortField = sortFieldMap[sortBy] || "created_at";

    // Construire la requête
    let query = supabaseAdmin
      .from("books")
      .select(
        "id, title, author, description, cover_url, category, file_format, created_at",
        { count: "exact" },
      );

    // Recherche par mot-clé (titre ou auteur)
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`,
      );
    }

    // Filtrer par catégorie
    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    // Tri et pagination
    query = query
      .order(dbSortField, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(`Erreur lors de la récupération des livres : ${error.message}`);
    }

    const books = (data || []).map((row: Record<string, unknown>) =>
      formatBookListItem(row),
    );
    const pagination = buildPaginationMeta(count || 0, page, limit);

    return { data: books, pagination };
  },

  /**
   * Détails complets d'un livre par ID.
   */
  async getById(id: string): Promise<Book> {
    const { data, error } = await supabaseAdmin
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw new NotFoundError(
        "BOOK_NOT_FOUND",
        "Aucun livre correspondant à l'identifiant fourni",
      );
    }

    return formatBook(data as unknown as Record<string, unknown>);
  },

  /**
   * Créer un livre : upload fichier + couverture vers Storage, insert en DB.
   * Conformité : INV-DATA-02
   */
  async create(
    data: { title: string; author: string; description: string; category?: string },
    file: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Book> {
    // Déterminer le format du fichier
    const fileFormat = file.mimetype === "application/pdf" ? "pdf" : "epub";
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload du fichier vers Supabase Storage
    const { error: fileError } = await supabaseAdmin.storage
      .from(env.STORAGE_BUCKET_BOOKS)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (fileError) {
      throw new Error(`Erreur lors de l'upload du fichier : ${fileError.message}`);
    }

    // Obtenir l'URL publique du fichier
    const { data: fileUrlData } = supabaseAdmin.storage
      .from(env.STORAGE_BUCKET_BOOKS)
      .getPublicUrl(fileName);

    const fileUrl = fileUrlData.publicUrl;

    // Upload de la couverture si présente
    let coverUrl: string | null = null;
    if (cover) {
      const coverName = `${Date.now()}-${cover.originalname}`;
      const { error: coverError } = await supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_COVERS)
        .upload(coverName, cover.buffer, {
          contentType: cover.mimetype,
          upsert: false,
        });

      if (coverError) {
        // Nettoyer le fichier uploadé si la couverture échoue
        await supabaseAdmin.storage
          .from(env.STORAGE_BUCKET_BOOKS)
          .remove([fileName]);
        throw new Error(`Erreur lors de l'upload de la couverture : ${coverError.message}`);
      }

      const { data: coverUrlData } = supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_COVERS)
        .getPublicUrl(coverName);

      coverUrl = coverUrlData.publicUrl;
    }

    // Insérer en DB
    const { data: newBook, error: dbError } = await supabaseAdmin
      .from("books")
      .insert({
        title: data.title,
        author: data.author,
        description: data.description,
        category: data.category || null,
        file_url: fileUrl,
        file_format: fileFormat,
        file_size: file.size,
        cover_url: coverUrl,
      })
      .select("*")
      .single();

    if (dbError || !newBook) {
      // Nettoyer les fichiers uploadés si l'insert échoue
      await supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_BOOKS)
        .remove([fileName]);
      if (cover) {
        const coverName = `${Date.now()}-${cover.originalname}`;
        await supabaseAdmin.storage
          .from(env.STORAGE_BUCKET_COVERS)
          .remove([coverName]);
      }
      throw new Error(`Erreur lors de la création du livre : ${dbError?.message}`);
    }

    return formatBook(newBook as unknown as Record<string, unknown>);
  },

  /**
   * Mettre à jour un livre : métadonnées et/ou fichiers.
   * Conformité : INV-DATA-02
   */
  async update(
    id: string,
    data: { title?: string; author?: string; description?: string; category?: string },
    file?: Express.Multer.File,
    cover?: Express.Multer.File,
  ): Promise<Book> {
    // Vérifier que le livre existe
    const existing = await this.getById(id);

    const updateData: Record<string, unknown> = {};

    // Métadonnées
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;

    // Nouveau fichier
    if (file) {
      const fileFormat = file.mimetype === "application/pdf" ? "pdf" : "epub";
      const fileName = `${Date.now()}-${file.originalname}`;

      // Upload du nouveau fichier
      const { error: fileError } = await supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_BOOKS)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (fileError) {
        throw new Error(`Erreur lors de l'upload du fichier : ${fileError.message}`);
      }

      const { data: fileUrlData } = supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_BOOKS)
        .getPublicUrl(fileName);

      // Supprimer l'ancien fichier
      const oldFileName = existing.fileUrl.split("/").pop();
      if (oldFileName) {
        await supabaseAdmin.storage
          .from(env.STORAGE_BUCKET_BOOKS)
          .remove([oldFileName]);
      }

      updateData.file_url = fileUrlData.publicUrl;
      updateData.file_format = fileFormat;
      updateData.file_size = file.size;
    }

    // Nouvelle couverture
    if (cover) {
      const coverName = `${Date.now()}-${cover.originalname}`;

      const { error: coverError } = await supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_COVERS)
        .upload(coverName, cover.buffer, {
          contentType: cover.mimetype,
          upsert: false,
        });

      if (coverError) {
        throw new Error(`Erreur lors de l'upload de la couverture : ${coverError.message}`);
      }

      const { data: coverUrlData } = supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_COVERS)
        .getPublicUrl(coverName);

      // Supprimer l'ancienne couverture
      if (existing.coverUrl) {
        const oldCoverName = existing.coverUrl.split("/").pop();
        if (oldCoverName) {
          await supabaseAdmin.storage
            .from(env.STORAGE_BUCKET_COVERS)
            .remove([oldCoverName]);
        }
      }

      updateData.cover_url = coverUrlData.publicUrl;
    }

    // Mettre à jour la date
    updateData.updated_at = new Date().toISOString();

    // Update en DB
    const { data: updatedBook, error: dbError } = await supabaseAdmin
      .from("books")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (dbError || !updatedBook) {
      throw new Error(`Erreur lors de la mise à jour du livre : ${dbError?.message}`);
    }

    return formatBook(updatedBook as unknown as Record<string, unknown>);
  },

  /**
   * Supprimer un livre : DB + Storage (atomique).
   * Conformité : G-DATA-02, INV-DATA-02
   */
  async delete(id: string): Promise<void> {
    // Récupérer le livre
    const book = await this.getById(id);

    // Supprimer le fichier du Storage
    const fileName = book.fileUrl.split("/").pop();
    if (fileName) {
      await supabaseAdmin.storage
        .from(env.STORAGE_BUCKET_BOOKS)
        .remove([fileName]);
    }

    // Supprimer la couverture si elle existe
    if (book.coverUrl) {
      const coverName = book.coverUrl.split("/").pop();
      if (coverName) {
        await supabaseAdmin.storage
          .from(env.STORAGE_BUCKET_COVERS)
          .remove([coverName]);
      }
    }

    // Supprimer l'enregistrement de la DB
    const { error } = await supabaseAdmin
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Erreur lors de la suppression du livre : ${error.message}`);
    }
  },
};
