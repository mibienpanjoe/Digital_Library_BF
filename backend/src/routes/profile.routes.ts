import { Router } from "express";
import { profileController } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  updateProfileSchema,
  updatePasswordSchema,
} from "../validators/profile.validator";

const router = Router();

// Tous les endpoints profil requièrent authentification
router.use(authMiddleware);

/**
 * GET /profile — 🔒 Auth
 * Récupérer le profil de l'utilisateur authentifié.
 */
router.get("/", profileController.get);

/**
 * PUT /profile — 🔒 Auth
 * Mettre à jour le profil.
 * Middleware : auth → validate
 */
router.put("/", validate(updateProfileSchema), profileController.update);

/**
 * PUT /profile/password — 🔒 Auth
 * Changer le mot de passe.
 * Middleware : auth → validate
 */
router.put(
  "/password",
  validate(updatePasswordSchema),
  profileController.updatePassword,
);

export default router;
