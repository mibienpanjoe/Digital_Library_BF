import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  updateProfileSchema,
  updatePasswordSchema,
} from "../validators/profile.validator";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentification requise
 */
router.get("/", profileController.get);

/**
 * @openapi
 * /profile:
 *   put:
 *     tags: [Profile]
 *     summary: Mettre à jour le profil
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.put("/", validate(updateProfileSchema), profileController.update);

/**
 * @openapi
 * /profile/password:
 *   put:
 *     tags: [Profile]
 *     summary: Changer le mot de passe
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.put(
  "/password",
  validate(updatePasswordSchema),
  profileController.updatePassword,
);

export default router;
