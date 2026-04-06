import { Response } from "express";
import Roster from "../models/Roster";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const createRoster = async (req: AuthRequest, res: Response) => {
    try {
        const { weekStart, weekEnd, primary, secondary, team } = req.body;

        if (!weekStart || !weekEnd || !primary || !secondary || !team) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can create roster"
            });
        }

        if (String(primary) === String(secondary)) {
            return res.status(400).json({
                message: "Primary and Secondary cannot be same"
            });
        }

        // Resolve userId strings to _id ObjectIds
        const primaryUser = await User.findOne({ userId: primary });
        const secondaryUser = await User.findOne({ userId: secondary });

        if (!primaryUser || !secondaryUser) {
            return res.status(400).json({ message: "Primary or Secondary user not found" });
        }

        const exists = await Roster.findOne({ weekStart, team });
        if (exists) {
            return res.status(400).json({
                message: "Roster already exists for this team and week"
            });
        }

        const roster = await Roster.create({
            weekStart,
            weekEnd,
            primary: primaryUser._id,
            secondary: secondaryUser._id,
            team,
            createdBy: req.user._id
        });

        res.status(201).json(roster);
    } catch (error) {
        console.error("CREATE ROSTER ERROR:", error);
        res.status(500).json({ message: "Failed to create roster" });
    }
};

export const getCurrentRoster = async (req: AuthRequest, res: Response) => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff)).toISOString().slice(0, 10);

    const filter: any = { weekStart: monday };
    if (req.query.team) {
        filter.team = req.query.team;
    }

    const rosters = await Roster.find(filter)
        .select("-_id -__v -createdBy")
        .populate("primary", "userId name email -_id")
        .populate("secondary", "userId name email -_id")
        .populate("team", "name -_id");

    res.json(rosters);
};

export const getRosterHistory = async (req: AuthRequest, res: Response) => {
    const filter: any = {};
    if (req.query.team) {
        filter.team = req.query.team;
    }

    const rosters = await Roster.find(filter)
        .select("-_id -__v -createdBy")
        .sort({ weekStart: -1 })
        .populate("primary", "userId name -_id")
        .populate("secondary", "userId name -_id")
        .populate("team", "name -_id");

    res.json(rosters);
};
