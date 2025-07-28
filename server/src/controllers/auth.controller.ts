import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        // avatar: null, 
        dateJoined: new Date(),
        lastUpdate: new Date(),
        isDeleted: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        // avatar: true,
        dateJoined: true,
        lastUpdate: true,
        isDeleted: true,
      },
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something Went Wrong! Try again Later!" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ message: "You Entered Wrong Login Credentials" });
      return;
    }

    const user = await client.user.findFirst({
      where: {
        AND: [
          { isDeleted: false },
          {
            OR: [{ username: identifier }, { email: identifier }],
          },
        ],
      },
       select: {
    id: true,
    email: true,
    username: true,
    password: true, 
    firstName: true,
    lastName: true,
    dateJoined: true,
    lastUpdate: true,
    isDeleted: true,
  },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const passAuth = await bcrypt.compare(password, user.password);
    if (!passAuth) {
      res.status(400).json({ message: "You Entered Wrong Login Credentials" });
      return;
    }

    const { password: loginPassword, ...userDetails } = user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }, 
    );

    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .json({
        message: "Login successful",
        user: userDetails,
        token,
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Bad request" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong during logout" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
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

    const user = await client.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, password: true, isDeleted: true },
    });

    if (!user || user.isDeleted) {
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

    await client.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
        lastUpdate: new Date(),
      },
    });

    res.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update password" });
  }
};
