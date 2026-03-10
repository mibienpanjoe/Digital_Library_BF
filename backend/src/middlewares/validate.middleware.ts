import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { errorResponse } from "../utils/response.util";

/**
 * Middleware factory de validation.
 * Prend un schéma Zod et retourne un middleware qui valide req.body.
 * Les champs non définis dans le schéma sont automatiquement écartés (strip).
 *
 * Conformité : G-SEC-04
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse et strip les champs non définis (sécurité : ignore 'role' etc.)
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");

        res.status(400).json(errorResponse("VALIDATION_ERROR", messages));
        return;
      }
      next(err);
    }
  };
}
