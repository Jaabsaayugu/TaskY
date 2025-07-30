import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/verifyToken";
import verifyUser from "../middleware/verifyUser";

const router: Router = Router();
const prisma = new PrismaClient();
import { createTask, getTasks } from "../controllers/task.controller";

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

// router.get("/", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;

//     const tasks = await prisma.task.findMany({
//       where: {
//         userId: userId,
//         isDeleted: false,
//       },
//       include: { user: true },
//       orderBy: { dateCreated: "desc" },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ message: "Failed to fetch tasks" });
//   }
// });

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
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
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

router.post("/", verifyUser, createTask);
router.get("/", verifyUser, getTasks);

// router.post("/", verifyToken, async (req: Request, res: Response) => {
//   const { title, description } = req.body;

//   try {
//     const task = await prisma.task.create({
//       data: {
//         title,
//         description,
//         userId: req.user!.id,
//       },
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     console.error("Error creating task:", error);
//     res.status(500).json({ message: "Failed to create task" });
//   }
// });

router.patch("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized or task not found" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized or task not found" });
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
