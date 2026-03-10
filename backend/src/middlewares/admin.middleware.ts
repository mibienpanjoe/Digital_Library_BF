import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.util";

/**
 * Middleware de vérification du rôle admin.
 * Doit être utilisé APRÈS auth.middleware (dépend de req.user).
 * Vérifie que l'utilisateur authentifié a le rôle 'admin'.
 *
 * Conformité : G-AUTHZ-03, X-ACC-02, INV-AUTHZ-03
 */
export function adminMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // Vérifier que l'utilisateur est authentifié (dépend de authMiddleware)
  if (!req.user) {
    next(new UnauthorizedError("Authentification requise"));
    return;
  }

  // Vérifier le rôle admin
  if (req.user.role !== "admin") {
    next(new ForbiddenError("Accès réservé aux administrateurs"));
    return;
  }

  next();
}
