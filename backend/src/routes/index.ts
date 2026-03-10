import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);
// Les routes suivantes seront ajoutées dans les phases ultérieures :
// router.use("/books", bookRoutes);
// router.use("/admin", adminRoutes);
// router.use("/profile", profileRoutes);

export default router;
