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

/**
 * POST /admin/books — 🔑 Admin
 * Ajouter un livre au catalogue.
 * Middlewares : auth → admin → upload → validate
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
 * Middlewares : auth → admin → upload
 */
router.put("/books/:id", uploadMiddleware, adminController.updateBook);

/**
 * DELETE /admin/books/:id — 🔑 Admin
 * Supprimer un livre.
 * Middlewares : auth → admin
 */
router.delete("/books/:id", adminController.deleteBook);

// Les routes admin users et dashboard seront ajoutées en Phase 5
// router.get("/users", adminController.getUsers);
// router.get("/users/:id/downloads", adminController.getUserDownloads);
// router.get("/dashboard/stats", adminController.getStats);

export default router;
