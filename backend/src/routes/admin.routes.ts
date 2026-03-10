import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createBookSchema } from "../validators/book.validator";

const router = Router();

// Tous les endpoints admin requièrent auth + admin
router.use(authMiddleware, adminMiddleware);

// ─── Livres ───────────────────────────────────────────────

/**
 * POST /admin/books — 🔑 Admin
 * Ajouter un livre au catalogue.
 */
router.post(
  "/books",
  uploadMiddleware,
  validate(createBookSchema),
  adminController.createBook,
);

/**
 * PUT /admin/books/:id — 🔑 Admin
 * Mettre à jour un livre.
 */
router.put("/books/:id", uploadMiddleware, adminController.updateBook);

/**
 * DELETE /admin/books/:id — 🔑 Admin
 * Supprimer un livre.
 */
router.delete("/books/:id", adminController.deleteBook);

// ─── Utilisateurs ─────────────────────────────────────────

/**
 * GET /admin/users — 🔑 Admin
 * Liste paginée des utilisateurs.
 */
router.get("/users", adminController.getUsers);

/**
 * GET /admin/users/:id/downloads — 🔑 Admin
 * Historique des téléchargements d'un utilisateur.
 */
router.get("/users/:id/downloads", adminController.getUserDownloads);

// ─── Dashboard ────────────────────────────────────────────

/**
 * GET /admin/dashboard/stats — 🔑 Admin
 * Statistiques agrégées de la plateforme.
 */
router.get("/dashboard/stats", adminController.getStats);

export default router;
