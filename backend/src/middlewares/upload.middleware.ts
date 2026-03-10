import multer from "multer";
import { Request } from "express";
import { env } from "../config/env";

/**
 * Types MIME acceptés par bucket.
 */
const ALLOWED_BOOK_MIMES = ["application/pdf", "application/epub+zip"];
const ALLOWED_COVER_MIMES = ["image/jpeg", "image/png"];
const ALL_ALLOWED_MIMES = [...ALLOWED_BOOK_MIMES, ...ALLOWED_COVER_MIMES];

/**
 * Filtre de fichiers : vérifie le type MIME.
 */
function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (ALL_ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Type de fichier non supporté : ${file.mimetype}. Types acceptés : PDF, ePub, JPEG, PNG`,
      ),
    );
  }
}

/**
 * Configuration Multer pour les uploads de livres.
 * - Champ 'file' : fichier du livre (PDF/ePub) — max 50 Mo
 * - Champ 'cover' : image de couverture (JPEG/PNG) — max 5 Mo
 *
 * Les fichiers sont stockés en mémoire (buffer) avant upload vers Supabase Storage.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024, // Taille max globale
  },
  fileFilter,
});

/**
 * Middleware d'upload pour la création/mise à jour de livres.
 * Accepte un fichier 'file' (livre) et un fichier 'cover' (couverture).
 */
export const uploadMiddleware = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);
