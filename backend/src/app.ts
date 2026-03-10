import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

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

// --- Routes ---
// Les routes seront montées ici dans les phases suivantes
// import routes from "./routes";
// app.use("/api/v1", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Error middleware ---
// Sera ajouté en Phase 2
// import { errorMiddleware } from "./middlewares/error.middleware";
// app.use(errorMiddleware);

export default app;
