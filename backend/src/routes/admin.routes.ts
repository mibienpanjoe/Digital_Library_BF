import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createBookSchema } from "../validators/book.validator";

const router = Router();

router.use(authMiddleware, adminMiddleware);

// ─── Livres ───────────────────────────────────────────────

/**
 * @openapi
 * /admin/books:
 *   post:
 *     tags: [Admin - Books]
 *     summary: Ajouter un livre au catalogue
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, author, description, file]
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Fichier du livre (PDF ou ePub)
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: Image de couverture (JPEG ou PNG)
 *     responses:
 *       201:
 *         description: Livre ajouté
 *       400:
 *         description: Données ou fichier manquant
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: Accès réservé aux administrateurs
 */
router.post(
  "/books",
  uploadMiddleware,
  validate(createBookSchema),
  adminController.createBook,
);

/**
 * @openapi
 * /admin/books/{id}:
 *   put:
 *     tags: [Admin - Books]
 *     summary: Mettre à jour un livre
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               file: { type: string, format: binary }
 *               cover: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *       404:
 *         description: Livre non trouvé
 */
router.put("/books/:id", uploadMiddleware, adminController.updateBook);

/**
 * @openapi
 * /admin/books/{id}:
 *   delete:
 *     tags: [Admin - Books]
 *     summary: Supprimer un livre
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       404:
 *         description: Livre non trouvé
 */
router.delete("/books/:id", adminController.deleteBook);

// ─── Utilisateurs ─────────────────────────────────────────

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Liste paginée des utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche par nom ou email
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/users", adminController.getUsers);

/**
 * @openapi
 * /admin/users/{id}/downloads:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Historique des téléchargements d'un utilisateur
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Historique des téléchargements
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/users/:id/downloads", adminController.getUserDownloads);

// ─── Dashboard ────────────────────────────────────────────

/**
 * @openapi
 * /admin/dashboard/stats:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Statistiques agrégées de la plateforme
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardStats'
 */
router.get("/dashboard/stats", adminController.getStats);

export default router;
