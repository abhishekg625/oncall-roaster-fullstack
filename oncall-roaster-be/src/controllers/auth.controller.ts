import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { userId, name, email, password, role } = req.body;

        const userIdExists = await User.findOne({ userId });
        if (userIdExists) {
            return res.status(400).json({ message: "UserId already taken" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userId,
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            token: generateToken(user._id.toString()),
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error("REGISTER ERROR FULL:", error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }

};


export const login = async (req: Request, res: Response) => {
    try {
        const { userId, password } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            token: generateToken(user._id.toString()),
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

export const getMe = async (req: any, res: Response) => {
    res.json(req.user);
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "Email, current password and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};
