import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { supabaseAdmin } from "../config/supabase";
import {
  UnauthorizedError,
  ConflictError,
} from "../utils/errors.util";
import { User } from "../types/user.types";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

const SALT_ROUNDS = 10;

/**
 * Génère un JWT signé pour un utilisateur.
 */
function generateToken(userId: string): string {
  const expiresInSeconds = parseExpiresIn(env.JWT_EXPIRES_IN);
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: expiresInSeconds,
  });
}

/**
 * Parse une durée d'expiration (ex: "24h", "7d", "60m") en secondes.
 */
function parseExpiresIn(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 86400; // 24h par défaut
  }
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case "s": return num;
    case "m": return num * 60;
    case "h": return num * 3600;
    case "d": return num * 86400;
    default: return 86400;
  }
}

/**
 * Formate un enregistrement DB en objet User (sans mot de passe).
 */
function formatUser(dbUser: Record<string, unknown>): User {
  return {
    id: dbUser.id as string,
    name: dbUser.name as string,
    email: dbUser.email as string,
    role: dbUser.role as "user" | "admin",
    createdAt: dbUser.created_at as string,
  };
}

export const authService = {
  /**
   * Inscription d'un nouvel utilisateur.
   * - Hash le mot de passe (bcrypt)
   * - Insère avec role = 'user' (jamais depuis le body)
   * - Génère un JWT
   *
   * Conformité : G-SEC-01, X-AUTH-01, X-AUTH-02, INV-ID-01, INV-ID-03
   */
  async register(
    data: RegisterInput,
  ): Promise<{ user: User; token: string }> {
    // Vérifier si l'email existe déjà
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existing) {
      throw new ConflictError(
        "EMAIL_ALREADY_EXISTS",
        "Un compte avec cet email existe déjà",
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Insérer l'utilisateur avec role = 'user' (jamais configurable)
    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user", // INV-ID-01 : toujours 'user' à l'inscription
      })
      .select("id, name, email, role, created_at")
      .single();

    if (error || !newUser) {
      throw new Error(`Erreur lors de la création de l'utilisateur : ${error?.message}`);
    }

    const user = formatUser(newUser);
    const token = generateToken(user.id);

    return { user, token };
  },

  /**
   * Connexion d'un utilisateur.
   * - Vérifie les credentials (email + mot de passe)
   * - Génère un JWT
   *
   * Conformité : G-SEC-03, INV-AUTHZ-02
   */
  async login(
    data: LoginInput,
  ): Promise<{ user: User; token: string }> {
    // Récupérer l'utilisateur par email
    const { data: dbUser, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, password, role, created_at")
      .eq("email", data.email)
      .single();

    if (error || !dbUser) {
      // Message générique pour ne pas révéler si l'email existe (X-AUTH-03)
      throw new UnauthorizedError(
        "Email ou mot de passe incorrect",
        "INVALID_CREDENTIALS",
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      data.password,
      dbUser.password as string,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        "Email ou mot de passe incorrect",
        "INVALID_CREDENTIALS",
      );
    }

    const user = formatUser(dbUser);
    const token = generateToken(user.id);

    return { user, token };
  },
};
