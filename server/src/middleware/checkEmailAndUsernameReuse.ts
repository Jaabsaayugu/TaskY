import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

async function checkUsernameAndEmailReuse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email } = req.body;
    const userWithSameDetails = await client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (userWithSameDetails) {
      res
        .status(400)
        .json({ message: "Email or Username is already being used" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Database error occurred." });
  }
}
export default checkUsernameAndEmailReuse;
