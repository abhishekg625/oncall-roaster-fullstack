import { Router } from "express";
import { createTeam, getTeams, getTeamById, updateTeamMembers } from "../controllers/team.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createTeam);
router.get("/", protect, getTeams);
router.get("/:id", protect, getTeamById);
router.patch("/:id/members", protect, updateTeamMembers);

export default router;
