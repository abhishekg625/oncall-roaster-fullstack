import { Router } from "express";
import {
    createRoster,
    getCurrentRoster,
    getRosterHistory
} from "../controllers/roster.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// POST /api/roster
router.post("/", protect, createRoster);

// GET /api/roster/current
router.get("/current", protect, getCurrentRoster);

// GET /api/roster/history
router.get("/history", protect, getRosterHistory);

export default router;
