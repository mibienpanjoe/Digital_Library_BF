import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Liste paginée des livres
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Recherche par titre ou auteur
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [title, author, createdAt] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: Liste des livres
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BookListItem'
 */
router.get("/", bookController.getAll);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Détails d'un livre
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Détails du livre
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Book'
 *       404:
 *         description: Livre non trouvé
 */
router.get("/:id", bookController.getById);

/**
 * @openapi
 * /books/{id}/download:
 *   get:
 *     tags: [Books]
 *     summary: Télécharger un livre
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Fichier du livre (PDF ou ePub)
 *         content:
 *           application/pdf: {}
 *           application/epub+zip: {}
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Livre non trouvé
 */
router.get("/:id/download", authMiddleware, bookController.download);

export default router;
