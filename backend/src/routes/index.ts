import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./book.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/admin", adminRoutes);
// router.use("/profile", profileRoutes); // Phase 5

export default router;
