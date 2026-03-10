import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du profil.
 * Seuls les champs envoyés sont mis à jour.
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .optional(),
  email: z
    .string()
    .email("Format d'email invalide")
    .optional(),
});

/**
 * Schéma de validation pour le changement de mot de passe.
 */
export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Le mot de passe actuel est requis" })
    .min(1, "Le mot de passe actuel est requis"),
  newPassword: z
    .string({ required_error: "Le nouveau mot de passe est requis" })
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
