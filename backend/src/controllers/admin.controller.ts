import { Request, Response, NextFunction } from "express";
import { bookService } from "../services/book.service";
import { successResponse } from "../utils/response.util";

/**
 * Extraire les fichiers uploadés depuis req.files (Multer fields).
 */
function getUploadedFiles(req: Request): {
  file?: Express.Multer.File;
  cover?: Express.Multer.File;
} {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  return {
    file: files?.file?.[0],
    cover: files?.cover?.[0],
  };
}

export const adminController = {
  /**
   * POST /admin/books — 🔑 Admin
   * Ajouter un nouveau livre au catalogue.
   * Réponse : 201 Created
   */
  createBook: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { file, cover } = getUploadedFiles(req);

      if (!file) {
        res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Le fichier du livre est requis",
          },
        });
        return;
      }

      const book = await bookService.create(req.body, file, cover);

      res
        .status(201)
        .json(successResponse(book, "Livre ajouté avec succès"));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /admin/books/:id — 🔑 Admin
   * Mettre à jour un livre existant.
   * Réponse : 200 OK
   */
  updateBook: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { file, cover } = getUploadedFiles(req);

      const book = await bookService.update(
        req.params.id as string,
        req.body,
        file,
        cover,
      );

      res.json(successResponse(book, "Livre mis à jour avec succès"));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /admin/books/:id — 🔑 Admin
   * Supprimer un livre et ses fichiers associés.
   * Réponse : 200 OK
   */
  deleteBook: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await bookService.delete(req.params.id as string);

      res.json(successResponse(null, "Livre supprimé avec succès"));
    } catch (error) {
      next(error);
    }
  },
};
