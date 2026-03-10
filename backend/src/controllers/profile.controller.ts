import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "../config/supabase";
import { successResponse } from "../utils/response.util";
import {
  UnauthorizedError,
  ConflictError,
} from "../utils/errors.util";
import { User } from "../types/user.types";

const SALT_ROUNDS = 10;

export const profileController = {
  /**
   * GET /profile — 🔒 Auth
   * Retourne le profil de l'utilisateur authentifié.
   */
  get: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.json(
        successResponse(req.user, "Profil récupéré avec succès"),
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /profile — 🔒 Auth
   * Met à jour le profil de l'utilisateur authentifié.
   */
  update: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { name, email } = req.body;

      // Si l'email change, vérifier l'unicité
      if (email && email !== req.user!.email) {
        const { data: existing } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", email)
          .neq("id", userId)
          .single();

        if (existing) {
          throw new ConflictError(
            "EMAIL_ALREADY_EXISTS",
            "Email déjà utilisé par un autre compte",
          );
        }
      }

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;

      const { data: updatedUser, error } = await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select("id, name, email, role, created_at")
        .single();

      if (error || !updatedUser) {
        throw new Error(
          `Erreur lors de la mise à jour du profil : ${error?.message}`,
        );
      }

      const user: User = {
        id: updatedUser.id as string,
        name: updatedUser.name as string,
        email: updatedUser.email as string,
        role: updatedUser.role as "user" | "admin",
        createdAt: updatedUser.created_at as string,
      };

      res.json(successResponse(user, "Profil mis à jour avec succès"));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /profile/password — 🔒 Auth
   * Met à jour le mot de passe de l'utilisateur authentifié.
   */
  updatePassword: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      // Récupérer le hash actuel du mot de passe
      const { data: dbUser, error: fetchError } = await supabaseAdmin
        .from("users")
        .select("password")
        .eq("id", userId)
        .single();

      if (fetchError || !dbUser) {
        throw new Error("Erreur lors de la récupération du profil");
      }

      // Vérifier le mot de passe actuel
      const isValid = await bcrypt.compare(
        currentPassword,
        dbUser.password as string,
      );

      if (!isValid) {
        throw new UnauthorizedError(
          "Mot de passe actuel incorrect",
          "INVALID_CURRENT_PASSWORD",
        );
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Mettre à jour en DB
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ password: hashedPassword })
        .eq("id", userId);

      if (updateError) {
        throw new Error(
          `Erreur lors de la mise à jour du mot de passe : ${updateError.message}`,
        );
      }

      res.json(
        successResponse(null, "Mot de passe mis à jour avec succès"),
      );
    } catch (error) {
      next(error);
    }
  },
};
