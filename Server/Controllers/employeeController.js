import mongoose from "mongoose";
import Employee from "../Models/employee.js";

export const createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department', 'dep_name');
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department', 'dep_name');
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('department', 'dep_name');
        if (!updatedEmployee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEmployeeLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('employee', 'name email department');
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const approveLeave = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }
        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rejectLeave = async (req, res) => {
    try {
        const leave = await Leave.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }
        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
