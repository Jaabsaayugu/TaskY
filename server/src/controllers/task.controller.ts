// import { PrismaClient } from "@prisma/client";
// import { Request, Response } from "express";
// const client = new PrismaClient();

// interface JwtPayload {
//   id: string;
//   email: string;
// }

// export const createTask = async (req: Request, res: Response) => {
//   try {
//     const { title, description } = req.body;
//     const { id } = req.user as JwtPayload;
//     const newTask = await client.task.create({
//       data: { title, description, userId: id },
//     });
//     res.status(201).json({ message: "New Task Created Successfully!" });
//   } catch (e) {
//     res.status(500).json({ message: "Something went Wrong Try again Later!" });
//   }
// };

// export const getTasks = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const { id } = req.user;
//     const tasks = await client.task.findMany({
//       where: { userId: id },
//     });
//     res.status(200).json(tasks);
//   } catch (e) {
//     res.status(500).json({ message: "something went Wrong! " });
//   }
// };
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateTaskData, UpdateTaskData } from "../types/express/index";

const prisma = new PrismaClient();

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description } = req.body as CreateTaskData;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required" });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        userId,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        dateCreated: "desc",
      },
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, isCompleted } = req.body as UpdateTaskData;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const updateData: UpdateTaskData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400).json({ error: "Title cannot be empty" });
        return;
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        res.status(400).json({ error: "Description cannot be empty" });
        return;
      }
      updateData.description = description.trim();
    }

    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const restoreTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const restoredTask = await prisma.task.update({
      where: { id },
      data: { isDeleted: false },
    });

    res.json({
      message: "Task restored successfully",
      task: restoredTask,
    });
  } catch (error) {
    console.error("Restore task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const completeTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const completedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });

    res.json({
      message: "Task marked as completed",
      task: completedTask,
    });
  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const incompleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const incompleteTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: false },
    });

    res.json({
      message: "Task marked as incomplete",
      task: incompleteTask,
    });
  } catch (error) {
    console.error("Incomplete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCompletedTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        isCompleted: true,
        isDeleted: false,
      },
      orderBy: {
        dateUpdated: "desc",
      },
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get completed tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDeletedTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: true,
      },
      orderBy: {
        dateUpdated: "desc",
      },
    });

    res.json({ tasks });
  } catch (error) {
    console.error("Get deleted tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
