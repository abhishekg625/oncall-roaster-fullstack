import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";

const router = Router();

// PATCH /api/users/:userId/availability
router.patch("/:userId/availability", protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const { isAvailableNextWeek } = req.body;

        const user = await User.findOneAndUpdate(
            { userId },
            { isAvailableNextWeek },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to update availability" });
    }
});

// PUT /api/users/:userId — update user info (admin only)
router.put("/:userId", protect, async (req: AuthRequest, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can update users" });
        }

        const { userId } = req.params;
        const { name, email, role } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const user = await User.findOneAndUpdate({ userId }, updateData, { new: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user" });
    }
});

// DELETE /api/users/:userId — delete user (admin only)
router.delete("/:userId", protect, async (req: AuthRequest, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can delete users" });
        }

        const { userId } = req.params;
        const user = await User.findOneAndDelete({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
});

export default router;
