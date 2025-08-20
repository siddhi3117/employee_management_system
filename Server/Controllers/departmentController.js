import mongoose from "mongoose";

import Department from "../Models/department.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, data: departments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get Department server error",
    });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({ dep_name, description });
    await newDep.save();
    return res.status(201).json({ success: true, Department: newDep });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "add department server error",
    });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }
    return res.status(200).json({ success: true, Department: department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get Department server error",
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updateDep = await Department.findByIdAndUpdate(
      id,
      { dep_name, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!updateDep) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }
    return res.status(200).json({ success: true, Department: updateDep });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "edit Department server error",
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid Department ID" });
    }
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }
    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "delete Department server error",
    });
  }
};
