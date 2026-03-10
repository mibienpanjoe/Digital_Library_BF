import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import { UnauthorizedError } from "../utils/errors.util";
import { User } from "../types/user.types";

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Middleware d'authentification.
 * Extrait le JWT depuis le header Authorization: Bearer <token>,
 * vérifie la signature et l'expiration, récupère l'utilisateur en DB
 * et l'attache à req.user.
 *
 * Conformité : INV-AUTHZ-01, INV-AUTHZ-02
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token d'authentification manquant");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token d'authentification manquant");
    }

    // Vérifier la signature et l'expiration du JWT
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new UnauthorizedError("Token invalide ou expiré");
    }

    // Récupérer l'utilisateur depuis la DB
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedError("Utilisateur non trouvé");
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    } as User;

    next();
  } catch (err) {
    next(err);
  }
}
