import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.util";
import { errorResponse } from "../utils/response.util";
import { env } from "../config/env";

/**
 * Middleware centralisé de gestion des erreurs.
 * Doit être monté EN DERNIER dans la chaîne de middlewares Express.
 * Capture toutes les erreurs (AppError + inattendues) et les formate
 * au format de réponse API standard.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Erreurs applicatives connues (AppError et sous-classes)
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message));
    return;
  }

  // Erreurs Multer (upload)
  if (err.name === "MulterError") {
    const multerErr = err as Error & { code: string };
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      res
        .status(413)
        .json(
          errorResponse(
            "FILE_TOO_LARGE",
            "Le fichier dépasse la taille maximale autorisée",
          ),
        );
      return;
    }
    res
      .status(400)
      .json(errorResponse("UPLOAD_ERROR", "Erreur lors de l'upload du fichier"));
    return;
  }

  // Erreurs inattendues
  console.error("❌ Erreur inattendue :", err);

  const message =
    env.NODE_ENV === "development"
      ? err.message
      : "Une erreur interne est survenue";

  res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", message));
}
