import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "gskuhiasuiauscgiugiaucgiuasgciasic";

interface JwtPayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export default function authenticateToken(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      error: "Access token required",
      message: "No authentication token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please log in again.",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Invalid token",
        message: "Invalid authentication token",
      });
    } else {
      res.status(403).json({
        error: "Token verification failed",
        message: "Authentication failed",
      });
    }
    return;
  }
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};
