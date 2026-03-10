import { z } from "zod";

/**
 * Schéma de validation pour l'inscription.
 * Le champ 'role' est intentionnellement ABSENT — tout champ non défini
 * dans le schéma est automatiquement écarté par Zod (strip).
 *
 * Conformité : X-AUTH-02
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

/**
 * Schéma de validation pour la connexion.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
