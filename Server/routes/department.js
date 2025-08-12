import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  addDepartment,
  getDepartments,
  getDepartment
} from "../Controllers/departmentController.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/add", authMiddleware, addDepartment);
router.get("/:id", authMiddleware, getDepartment);
router.put("/:id", authMiddleware, editDepartment);

export default router;
