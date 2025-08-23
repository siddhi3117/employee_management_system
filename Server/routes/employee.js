import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeLeaves,
    approveLeave,
    rejectLeave,
    employeeSummary
} from "../Controllers/employeeController.js";

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/leaves", authMiddleware, getEmployeeLeaves);
router.post("/summary", authMiddleware, employeeSummary);
router.get("/:id", authMiddleware, getEmployeeById);
router.post("/create", createEmployee);
router.put("/update/:id", authMiddleware, updateEmployee);
router.delete("/delete/:id", authMiddleware, deleteEmployee);
router.post("/leave/:id/reject", authMiddleware, rejectLeave);
router.post("/leave/:id/approve", authMiddleware, approveLeave);

export default router;
