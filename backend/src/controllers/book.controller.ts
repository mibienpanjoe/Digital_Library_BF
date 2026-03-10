import { Request, Response, NextFunction } from "express";
import { bookService } from "../services/book.service";
import { downloadService } from "../services/download.service";
import { successResponse } from "../utils/response.util";
import { BookFilters } from "../types/response.types";

export const bookController = {
  /**
   * GET /books — 🌐 Public
   * Liste paginée des livres avec recherche, filtrage et tri.
   */
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters: BookFilters = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        order: req.query.order as "asc" | "desc" | undefined,
      };

      const result = await bookService.getAll(filters);

      res.json(successResponse(result.data, undefined, result.pagination));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /books/:id — 🌐 Public
   * Détails complets d'un livre.
   */
  getById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const book = await bookService.getById(req.params.id as string);

      res.json(successResponse(book, "Livre récupéré avec succès"));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /books/:id/download — 🔒 Auth
   * Télécharge le fichier d'un livre.
   */
  download: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = req.user!.id;

      const file = await downloadService.downloadBook(id, userId);

      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`,
      );
      res.send(file.buffer);
    } catch (error) {
      next(error);
    }
  },
};
