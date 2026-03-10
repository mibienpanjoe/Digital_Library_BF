import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Digital Library BF — API",
    version: "1.0.0",
    description:
      "API REST de la Bibliothèque Numérique du Burkina Faso. " +
      "Permet la gestion des livres, des utilisateurs et des téléchargements.",
    contact: {
      name: "Digital Library BF",
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: "Serveur de développement",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT obtenu via /auth/login ou /auth/register",
      },
    },
    schemas: {
      // ─── Réponses ─────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "object" },
          message: { type: "string" },
          pagination: { $ref: "#/components/schemas/Pagination" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Données invalides" },
            },
          },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 20 },
          total: { type: "integer", example: 100 },
          totalPages: { type: "integer", example: 5 },
        },
      },

      // ─── Auth ─────────────────────────────────────────────
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jean Dupont", minLength: 2 },
          email: { type: "string", format: "email", example: "jean@example.com" },
          password: { type: "string", minLength: 8, example: "monMotDePasse123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "jean@example.com" },
          password: { type: "string", example: "monMotDePasse123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
        },
      },

      // ─── User ─────────────────────────────────────────────
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Jean Dupont" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["user", "admin"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Book ─────────────────────────────────────────────
      Book: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "L'Aventure Ambiguë" },
          author: { type: "string", example: "Cheikh Hamidou Kane" },
          description: { type: "string" },
          coverUrl: { type: "string", nullable: true },
          fileUrl: { type: "string" },
          fileFormat: { type: "string", enum: ["pdf", "epub"] },
          fileSize: { type: "integer" },
          category: { type: "string", nullable: true },
          downloadCount: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      BookListItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          author: { type: "string" },
          description: { type: "string" },
          coverUrl: { type: "string", nullable: true },
          category: { type: "string", nullable: true },
          fileFormat: { type: "string", enum: ["pdf", "epub"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Dashboard ────────────────────────────────────────
      DashboardStats: {
        type: "object",
        properties: {
          totalBooks: { type: "integer" },
          totalUsers: { type: "integer" },
          totalDownloads: { type: "integer" },
          recentDownloads: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                  },
                },
                book: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                  },
                },
                downloadedAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Inscription et connexion" },
    { name: "Books", description: "Catalogue public des livres" },
    { name: "Profile", description: "Gestion du profil utilisateur" },
    { name: "Admin - Books", description: "Gestion des livres (admin)" },
    { name: "Admin - Users", description: "Gestion des utilisateurs (admin)" },
    { name: "Admin - Dashboard", description: "Statistiques (admin)" },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  // Chemins vers les fichiers contenant les annotations JSDoc
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
