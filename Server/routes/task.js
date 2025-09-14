import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
  getTaskStats
} from "../Controllers/taskController.js";

const router = express.Router();

// Admin routes
router.post("/create", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Employee routes
router.get("/employee/my-tasks", authMiddleware, getMyTasks);
router.put("/employee/:id/status", authMiddleware, updateTaskStatus);
router.get("/employee/stats", authMiddleware, getTaskStats);

export default router;
