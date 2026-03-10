import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { swaggerSpec } from "./config/swagger";

const app = express();

// --- Middlewares globaux ---

// CORS
app.use(cors());

// Parsing JSON
app.use(express.json());

// Parsing URL-encoded (pour formulaires)
app.use(express.urlencoded({ extended: true }));

// Rate Limiter — protection DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par fenêtre par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Trop de requêtes, veuillez réessayer plus tard",
    },
  },
});
app.use(limiter);

// --- Documentation Swagger ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Digital Library BF — API Docs",
  customCss: ".swagger-ui .topbar { display: none }",
}));

// Endpoint JSON de la spec OpenAPI
app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

// --- Routes ---
app.use("/api/v1", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Error middleware (DOIT être en dernier) ---
app.use(errorMiddleware);

export default app;
