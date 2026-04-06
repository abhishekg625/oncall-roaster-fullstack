import { Router } from "express";
import {
    login,
    register,
    getMe,
    resetPassword
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", protect, getMe);
router.patch("/reset-password", resetPassword);
router.get("/users", protect, async (_req, res) => {
    const users = await (await import("../models/User")).default.find().select("-password");
    res.json(users);
});


export default router;
