import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const client = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user as JwtPayload;
    const newTask = await client.task.create({
      data: { title, description, userId: id },
    });
    res.status(201).json({message: "New Task Created Successfully!"});
  } catch (e) {
    res.status(500).json({ message: "Something went Wrong Try again Later!" });
  }
};

export const getTasks = async ( req:Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.user;
    const tasks = await client.task.findMany({
      where: { userId: id }
    })
    res.status(200).json(tasks);
  }catch(e) {
    res.status(500).json({ message: "something went Wrong! "})
  }
}
