// import { Router } from "express";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "../middleware/verifyToken";

// const router = Router();
// const prisma = new PrismaClient();

// router.get("/", async (_req, res) => {
//   const tasks = await prisma.task.findMany({
//     where: { isDeleted: false },
//     include: { user: true },
//     orderBy: { createdAt: "desc" },
//   });

//   res.json(tasks);
// });

// router.get("/tasks/:id", verifyToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const task = await prisma.task.findUnique({
//       where: { id },
//       include: {
//          user: {
//           select: {firstName: true, lastName: true },
//          },
//         },
//     });

//     if (!task || task.isDeleted) {
//       res.status(404).json({ message: "task not found" });
//     }

//     res.json(task);
//   } catch (error) {
//     console.error("Error fetching task:", error);
//     res.status(500).json({ message: "Failed to fetch task" });
//   }
// });

// router.post("/", verifyToken, async (req, res) => {
//   const { title, synopsis, content, imageUrl } = req.body;

//   const task = await prisma.task.create({
//     data: {
//       title,
//       synopsis,
//       content,
//       imageUrl,
//       userId: req.user!.id,
//     },
//   });

//   res.status(201).json(task);
// });

// router.patch("/:id", verifyToken, async (req, res) => {
//   const { title, synopsis, content, imageUrl } = req.body;

//   const existing = await prisma.task.findUnique({
//     where: { id: req.params.id },
//   });
//   if (!existing || existing.userId !== req.user!.id) {
//     res.status(403).json({ message: "Unauthorized or task not found" });
//   }

//   const updated = await prisma.task.update({
//     where: { id: req.params.id },
//     data: { title, synopsis, content, imageUrl },
//   });

//   res.json(updated);
// });

// router.delete("/:id", verifyToken, async (req, res) => {
//   const task = await prisma.task.findUnique({ where: { id: req.params.id } });
//   if (!task || task.userId !== req.user!.id) {
//     res.status(403).json({ message: "Unauthorized or task not found" });
//   }

//   await prisma.task.update({
//     where: { id: req.params.id },
//     data: { isDeleted: true },
//   });

//   res.json({ message: "Task deleted" });
// });

// export default router;
