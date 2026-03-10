import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { successResponse } from "../utils/response.util";

export const authController = {
  /**
   * POST /auth/register
   * Crée un nouveau compte utilisateur.
   * Réponse : 201 Created
   */
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await authService.register(req.body);

      res
        .status(201)
        .json(successResponse(result, "Inscription réussie"));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /auth/login
   * Authentifie un utilisateur.
   * Réponse : 200 OK
   */
  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await authService.login(req.body);

      res
        .status(200)
        .json(successResponse(result, "Connexion réussie"));
    } catch (error) {
      next(error);
    }
  },
};
