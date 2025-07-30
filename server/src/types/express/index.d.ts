import { Request } from "express";

export interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isDeleted: boolean;
}

// Global module augmentation - this extends Express Request globally
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Task-related interfaces
export interface CreateTaskData {
  title: string;
  description: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

// User-related interfaces (uncommented since you might need them)
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
