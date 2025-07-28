"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                // avatar: true,
                dateJoined: true,
                lastUpdate: true,
                isDeleted: true,
            },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch user details" });
    }
}));
router.patch("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, username, email } = req.body;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        if (username || email) {
            const existingUser = yield prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: req.user.id } },
                        {
                            OR: [username ? { username } : {}, email ? { email } : {}],
                        },
                    ],
                },
            });
            if (existingUser) {
                res.status(400).json({
                    message: existingUser.username === username
                        ? "Username already exists"
                        : "Email already exists",
                });
                return;
            }
        }
        const updateData = {
            lastUpdate: new Date(),
        };
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (username)
            updateData.username = username;
        if (email)
            updateData.email = email;
        const updated = yield prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                // avatar: true,
                dateJoined: true,
                lastUpdate: true,
                isDeleted: true,
            },
        });
        res.json({ message: "Profile updated successfully", user: updated });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not update profile" });
    }
}));
router.patch("/password", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        res.status(400).json({
            message: "Current password, new password, and confirm password are required",
        });
        return;
    }
    if (newPassword !== confirmNewPassword) {
        res.status(400).json({ message: "New passwords do not match" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, password: true },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const validCurrentPassword = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!validCurrentPassword) {
            res.status(400).json({ message: "Incorrect current password" });
            return;
        }
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma.user.update({
            where: { id: req.user.id },
            data: {
                password: hashedNewPassword,
                lastUpdate: new Date(),
            },
        });
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update password" });
    }
}));
exports.default = router;
