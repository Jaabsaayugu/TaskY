import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  restoreTask,
  completeTask,
  incompleteTask,
  getCompletedTasks,
  getDeletedTasks,
} from "../controllers/task.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/completed", getCompletedTasks);
router.get("/deleted", getDeletedTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/restore", restoreTask);
router.patch("/:id/complete", completeTask);
router.patch("/:id/incomplete", incompleteTask);

export default router;
