import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../Controllers/employeeController.js";

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.post("/create", createEmployee);
router.put("/update/:id", authMiddleware, updateEmployee);
router.delete("/delete/:id", authMiddleware, deleteEmployee);

export default router;
