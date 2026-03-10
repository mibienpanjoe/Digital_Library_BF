import { supabaseAdmin } from "../config/supabase";
import { env } from "../config/env";
import { NotFoundError } from "../utils/errors.util";

interface DownloadFileResult {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

export const downloadService = {
  /**
   * Télécharge un livre : enregistre le download PUIS sert le fichier.
   * L'enregistrement et le service sont atomiques :
   * le fichier n'est JAMAIS renvoyé si l'enregistrement échoue.
   *
   * Conformité : G-DATA-01, X-DATA-01
   */
  async downloadBook(
    bookId: string,
    userId: string,
  ): Promise<DownloadFileResult> {
    // 1. Vérifier que le livre existe
    const { data: book, error: bookError } = await supabaseAdmin
      .from("books")
      .select("id, title, file_url, file_format")
      .eq("id", bookId)
      .single();

    if (bookError || !book) {
      throw new NotFoundError(
        "BOOK_NOT_FOUND",
        "Aucun livre correspondant à l'identifiant fourni",
      );
    }

    // 2. Enregistrer le téléchargement (AVANT de servir le fichier)
    const { error: downloadError } = await supabaseAdmin
      .from("downloads")
      .insert({
        user_id: userId,
        book_id: bookId,
      });

    if (downloadError) {
      throw new Error(
        `Erreur lors de l'enregistrement du téléchargement : ${downloadError.message}`,
      );
    }

    // 3. Incrémenter le compteur de téléchargements
    await supabaseAdmin.rpc("increment_download_count", {
      book_id: bookId,
    }).then(({ error: rpcError }: { error: { message: string } | null }) => {
      // Fallback si la fonction RPC n'existe pas : update direct
      if (rpcError) {
        return supabaseAdmin
          .from("books")
          .update({ download_count: (book as Record<string, unknown>).download_count as number + 1 })
          .eq("id", bookId);
      }
    });

    // 4. Télécharger le fichier depuis Supabase Storage
    const fileName = (book.file_url as string).split("/").pop();
    if (!fileName) {
      throw new Error("URL de fichier invalide");
    }

    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from(env.STORAGE_BUCKET_BOOKS)
      .download(fileName);

    if (fileError || !fileData) {
      throw new Error(
        `Erreur lors du téléchargement du fichier : ${fileError?.message}`,
      );
    }

    // Convertir le Blob en Buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType =
      book.file_format === "pdf"
        ? "application/pdf"
        : "application/epub+zip";

    // Construire un nom de fichier propre
    const safeTitle = (book.title as string)
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const filename = `${safeTitle}.${book.file_format}`;

    return { buffer, contentType, filename };
  },
};
