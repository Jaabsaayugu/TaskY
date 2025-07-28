import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();
const prisma = new PrismaClient();

router.get("/", verifyToken, async (req, res): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
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
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

router.patch("/", verifyToken, async (req, res): Promise<void> => {
  const { firstName, lastName, username, email } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    if (username || email) {
      const existingUser = await prisma.user.findFirst({
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
          message:
            existingUser.username === username
              ? "Username already exists"
              : "Email already exists",
        });
        return;
      }
    }

    const updateData: any = {
      lastUpdate: new Date(),
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updated = await prisma.user.update({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update profile" });
  }
});

router.patch("/password", verifyToken, async (req, res): Promise<void> => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    res.status(400).json({
      message:
        "Current password, new password, and confirm password are required",
    });
    return;
  }

  if (newPassword !== confirmNewPassword) {
    res.status(400).json({ message: "New passwords do not match" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const validCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!validCurrentPassword) {
      res.status(400).json({ message: "Incorrect current password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
        lastUpdate: new Date(),
      },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

export default router;
