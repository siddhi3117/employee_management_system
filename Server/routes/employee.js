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
    employeeSummary,
    getLeavesOfEmployee,
    addLeave,
    getEmployeeProfile,
    changePassword,
    updateProfile
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
router.post("/getleaves", authMiddleware, getLeavesOfEmployee);
router.post("/addleave", authMiddleware, addLeave);
router.get("/profile", authMiddleware, getEmployeeProfile);
router.post("/change-password", authMiddleware, changePassword);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;
