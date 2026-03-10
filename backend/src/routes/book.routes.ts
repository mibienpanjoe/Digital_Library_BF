import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * GET /books — 🌐 Public
 * Liste paginée des livres.
 */
router.get("/", bookController.getAll);

/**
 * GET /books/:id — 🌐 Public
 * Détails d'un livre.
 */
router.get("/:id", bookController.getById);

/**
 * GET /books/:id/download — 🔒 Auth
 * Télécharger un livre (nécessite authentification).
 */
router.get("/:id/download", authMiddleware, bookController.download);

export default router;
