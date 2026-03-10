import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator";

const router = Router();

/**
 * POST /auth/register — 🌐 Public
 * Middleware : validate (registerSchema)
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * POST /auth/login — 🌐 Public
 * Middleware : validate (loginSchema)
 */
router.post("/login", validate(loginSchema), authController.login);

export default router;
