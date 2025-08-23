import mongoose from "mongoose";
import Employee from "../Models/employee.js";
import Leave from "../Models/leaves.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";

// Helper function to create user account for existing employee
const createUserForEmployee = async (employee) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: employee.email });
        if (existingUser) {
            return existingUser;
        }

        // Generate default password
        const defaultPassword = "employee123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create user account
        const newUser = new User({
            name: employee.name,
            email: employee.email,
            password: hashedPassword,
            role: "employee",
            employeeRef: employee._id
        });
        await newUser.save();

        // Update employee with user reference
        employee.userRef = newUser._id;
        await employee.save();

        return newUser;
    } catch (error) {
        console.error("Error creating user for employee:", error);
        throw error;
    }
};

export const createEmployee = async (req, res) => {
    try {
        // Check if user with this email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User with this email already exists" });
        }

        // Check if employee with this email already exists
        const existingEmployee = await Employee.findOne({ email: req.body.email });
        if (existingEmployee) {
            return res.status(400).json({ success: false, error: "Employee with this email already exists" });
        }

        // Create the employee first
        const newEmployee = new Employee(req.body);
        await newEmployee.save();

        // Generate default password (you can customize this)
        const defaultPassword = "employee123"; // You might want to make this configurable
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create user account for the employee
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: "employee",
            employeeRef: newEmployee._id
        });
        await newUser.save();

        // Update employee with user reference
        newEmployee.userRef = newUser._id;
        await newEmployee.save();

        // Populate department info for response
        const employeeWithDept = await Employee.findById(newEmployee._id).populate('department', 'dep_name');

        res.status(201).json({ 
            success: true, 
            data: employeeWithDept,
            message: `Employee created successfully. Default password is: ${defaultPassword}`
        });
    } catch (error) {
        console.error("Create employee error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department', 'dep_name').populate('userRef', 'name email role');
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error("Get all employees error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('department', 'dep_name')
            .populate('userRef', 'name email role');
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error("Get employee by ID error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('department', 'dep_name');
        
        // Update associated user account if it exists
        if (employee.userRef && (req.body.name || req.body.email)) {
            const userUpdateData = {};
            if (req.body.name) userUpdateData.name = req.body.name;
            if (req.body.email) userUpdateData.email = req.body.email;
            
            await User.findByIdAndUpdate(employee.userRef, userUpdateData);
        }

        res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
        console.error("Update employee error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Delete associated user account if it exists
        if (employee.userRef) {
            await User.findByIdAndDelete(employee.userRef);
        }

        // Delete the employee
        await Employee.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ success: true, message: "Employee and associated user account deleted successfully" });
    } catch (error) {
        console.error("Delete employee error:", error);
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

export const employeeSummary = async (req, res) => {
    try{
        const userId = req.user._id; // Get user ID from auth middleware
        
        // Find employee using the user reference
        const employee = await Employee.findOne({ userRef: userId });
        
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        
        const employeeId = employee._id;
        const leaves = await Leave.find({ employee: employeeId });
        const totalLeaves = leaves.length;
        const approvedLeaves = leaves.filter(leave => leave.status === "approved").length;
        const pendingLeaves = leaves.filter(leave => leave.status === "pending").length;
        const rejectedLeaves = leaves.filter(leave => leave.status === "rejected").length;

        // Calculate profile completion based on filled fields
        let profileCompletion = 0;
        const fields = ['name', 'email', 'department', 'salary', 'profileImage'];
        const filledFields = fields.filter(field => employee[field] && employee[field] !== '');
        profileCompletion = Math.round((filledFields.length / fields.length) * 100);

        // For now, set payments to 0 since Payment model doesn't exist
        const totalPayments = 0;

        res.status(200).json({
            leaves_taken: totalLeaves,
            leave_pending: pendingLeaves,
            leave_approved: approvedLeaves,
            leave_rejected: rejectedLeaves,
            payments_received: totalPayments,
            profile_completion: profileCompletion,
        });
    } catch (error) {
        console.error("Employee summary error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
