import { Router } from "express";
import { processAICommand } from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// The base path is now '/ai' from app.ts, so the route is '/process'
router.post("/process", authenticate, processAICommand);

export default router;