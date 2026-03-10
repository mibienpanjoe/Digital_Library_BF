import { z } from "zod";

/**
 * Schéma de validation pour la création d'un livre.
 * Les champs de fichier (file, cover) sont gérés par Multer, pas par Zod.
 */
export const createBookSchema = z.object({
  title: z
    .string({ required_error: "Le titre est requis" })
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),
  author: z
    .string({ required_error: "L'auteur est requis" })
    .min(2, "L'auteur doit contenir au moins 2 caractères")
    .max(255, "L'auteur ne peut pas dépasser 255 caractères"),
  description: z
    .string({ required_error: "La description est requise" })
    .min(1, "La description est requise"),
  category: z.string().optional(),
});

/**
 * Schéma de validation pour la mise à jour d'un livre.
 * Tous les champs sont optionnels — seuls les champs envoyés sont mis à jour.
 */
export const updateBookSchema = z.object({
  title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(255, "Le titre ne peut pas dépasser 255 caractères")
    .optional(),
  author: z
    .string()
    .min(2, "L'auteur doit contenir au moins 2 caractères")
    .max(255, "L'auteur ne peut pas dépasser 255 caractères")
    .optional(),
  description: z
    .string()
    .min(1, "La description est requise")
    .optional(),
  category: z.string().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
