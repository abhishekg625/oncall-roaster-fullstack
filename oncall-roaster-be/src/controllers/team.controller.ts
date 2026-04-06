import { Response } from "express";
import Team from "../models/Team";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTeam = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create teams" });
        }

        const { name, members } = req.body;

        if (!name || !members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: "Team name and at least one member required" });
        }

        const exists = await Team.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: "Team name already exists" });
        }

        // Resolve userId strings to _id ObjectIds
        const memberUsers = await User.find({ userId: { $in: members } }).select("_id");
        if (memberUsers.length !== members.length) {
            return res.status(400).json({ message: "One or more members not found" });
        }
        const memberObjectIds = memberUsers.map(u => u._id);

        const team = await Team.create({
            name,
            members: memberObjectIds,
            createdBy: req.user._id
        });

        const populated = await team.populate("members", "userId name email isAvailableNextWeek");

        res.status(201).json(populated);
    } catch (error: any) {
        console.error("CREATE TEAM ERROR:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
};

export const getTeams = async (_req: AuthRequest, res: Response) => {
    try {
        const teams = await Team.find()
            .populate("members", "userId name email isAvailableNextWeek")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch teams" });
    }
};

export const getTeamById = async (req: AuthRequest, res: Response) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("members", "userId name email isAvailableNextWeek");

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch team" });
    }
};

export const updateTeamMembers = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can update teams" });
        }

        const { members } = req.body;

        if (!members || !Array.isArray(members)) {
            return res.status(400).json({ message: "Members array is required" });
        }

        // Resolve userId strings to _id ObjectIds
        const memberUsers = await User.find({ userId: { $in: members } }).select("_id");
        const memberObjectIds = memberUsers.map(u => u._id);

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { members: memberObjectIds },
            { new: true }
        ).populate("members", "userId name email isAvailableNextWeek");

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(team);
    } catch (error) {
        console.error("UPDATE TEAM ERROR:", error);
        res.status(500).json({ message: "Failed to update team" });
    }
};
