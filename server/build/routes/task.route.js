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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// router.get("/", verifyToken,async (_req: Request, res: Response) => {
//   try {
//     const tasks = await prisma.task.findMany({
//       where: { isDeleted: false },
//       include: { user: true },
//       orderBy: { dateCreated: "desc" },
//     });
//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ message: "Failed to fetch tasks" });
//   }
// });
router.get("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const tasks = yield prisma.task.findMany({
            where: {
                userId: userId,
                isDeleted: false,
            },
            include: { user: true },
            orderBy: { dateCreated: "desc" },
        });
        res.json(tasks);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
}));
router.get("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield prisma.task.findUnique({
            where: { id },
            include: {
                user: {
                    select: { firstName: true, lastName: true },
                },
            },
        });
        if (!task || task.isDeleted) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    }
    catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Failed to fetch task" });
    }
}));
router.post("/", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    try {
        const task = yield prisma.task.create({
            data: {
                title,
                description,
                userId: req.user.id,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Failed to create task" });
    }
}));
router.patch("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const existing = yield prisma.task.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Unauthorized or task not found" });
        }
        const updated = yield prisma.task.update({
            where: { id },
            data: {
                title,
                description,
            },
        });
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Failed to update task" });
    }
}));
router.delete("/:id", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== req.user.id) {
            return res
                .status(403)
                .json({ message: "Unauthorized or task not found" });
        }
        yield prisma.task.update({
            where: { id },
            data: { isDeleted: true },
        });
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Failed to delete task" });
    }
}));
exports.default = router;
