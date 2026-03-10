/**
 * Classes d'erreurs applicatives.
 * Utilisées par les services et capturées par le error.middleware.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 400 Bad Request */
export class ValidationError extends AppError {
  constructor(message: string = "Données invalides") {
    super(400, "VALIDATION_ERROR", message);
  }
}

/** 401 Unauthorized */
export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Authentification requise",
    code: string = "UNAUTHORIZED",
  ) {
    super(401, code, message);
  }
}

/** 403 Forbidden */
export class ForbiddenError extends AppError {
  constructor(message: string = "Accès interdit") {
    super(403, "FORBIDDEN", message);
  }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(code: string, message: string = "Ressource introuvable") {
    super(404, code, message);
  }
}

/** 409 Conflict */
export class ConflictError extends AppError {
  constructor(code: string, message: string = "Conflit de données") {
    super(409, code, message);
  }
}
