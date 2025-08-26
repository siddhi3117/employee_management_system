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
        // Get all leaves with employee information
        const leaves = await Leave.find()
            .populate({
                path: 'employee',
                select: 'name email department',
                populate: {
                    path: 'department',
                    select: 'dep_name'
                }
            })
            .sort({ status: 1, createdAt: -1 }); // Sort by status (pending first) then by creation date

        // Clean up orphaned leaves (leaves without valid employee references)
        const orphanedLeaves = leaves.filter(leave => leave.employee === null);
        if (orphanedLeaves.length > 0) {
            console.log(`Found ${orphanedLeaves.length} orphaned leaves, cleaning up...`);
            const orphanedIds = orphanedLeaves.map(leave => leave._id);
            await Leave.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`Cleaned up ${orphanedLeaves.length} orphaned leaves`);
        }

        // Format leaves to include employee details, filtering out leaves with null employees
        const formattedLeaves = leaves
            .filter(leave => leave.employee !== null) // Filter out leaves with null employee references
            .map(leave => {
                try {
                    return {
                        _id: leave._id,
                        employeeId: leave.employee._id,
                        name: leave.employee.name || "Unknown Employee",
                        email: leave.employee.email || "No email",
                        department: leave.employee.department?.dep_name || "N/A",
                        leaveType: leave.leaveType,
                        fromDate: leave.fromDate,
                        toDate: leave.toDate,
                        status: leave.status,
                        reason: leave.reason,
                        createdAt: leave.createdAt
                    };
                } catch (err) {
                    console.error("Error formatting leave:", err, leave);
                    return null;
                }
            })
            .filter(leave => leave !== null); // Remove any null entries from formatting errors

        res.status(200).json({ success: true, data: formattedLeaves });
    } catch (error) {
        console.error("Get employee leaves error:", error);
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

// Get approved leaves for a specific employee and month/year
export const getApprovedLeavesByEmployeeAndMonth = async (req, res) => {
    try {
        const { id } = req.params; // employee id
        const month = parseInt(req.query.month, 10); // 0-based month
        const year = parseInt(req.query.year, 10);

        if (Number.isNaN(month) || Number.isNaN(year)) {
            return res.status(400).json({ success: false, error: "Invalid month/year" });
        }

        // Validate employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        const rangeStart = new Date(year, month, 1, 0, 0, 0, 0);
        const rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

        // Fetch approved leaves that overlap the month
        const leaves = await Leave.find({
            employee: id,
            status: "approved",
            $or: [
                { fromDate: { $lte: rangeEnd }, toDate: { $gte: rangeStart } },
            ]
        }).select("leaveType fromDate toDate status");

        // Count working days within the month covered by approved leaves (exclude Sat/Sun)
        let totalLeaveDays = 0;
        const detailed = [];
        leaves.forEach(leave => {
            const leaveStart = new Date(Math.max(leave.fromDate.getTime(), rangeStart.getTime()));
            const leaveEnd = new Date(Math.min(leave.toDate.getTime(), rangeEnd.getTime()));
            let days = 0;
            for (let d = new Date(leaveStart); d <= leaveEnd; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    days++;
                }
            }
            totalLeaveDays += days;
            detailed.push({
                leaveType: leave.leaveType,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                status: leave.status,
                workingDaysCounted: days
            });
        });

        return res.status(200).json({ success: true, data: { totalLeaveDays, leaves: detailed } });
    } catch (error) {
        console.error("Get approved leaves by employee and month error:", error);
        return res.status(500).json({ success: false, error: error.message });
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

export const getLeavesOfEmployee = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from auth middleware
        
        // Find employee using the user reference
        const employee = await Employee.findOne({ userRef: userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        
        const leaves = await Leave.find({ employee: employee._id });
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        console.error("Get leaves of employee error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
export const addLeave = async (req, res) => {
    try {
        const { fromDate, toDate, leaveType, reason } = req.body;
        const userId = req.user._id;

        // Find the employee using the user reference
        const employee = await Employee.findOne({ userRef: userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        const newLeave = new Leave({
            employee: employee._id,
            fromDate,
            toDate,
            leaveType,
            reason,
            status: "pending"
        });

        await newLeave.save();
        res.status(201).json({ success: true, data: newLeave });
    } catch (error) {
        console.error("Add leave error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get employee profile information
export const getEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find employee using the user reference
        const employee = await Employee.findOne({ userRef: userId })
            .populate('department', 'dep_name');
        
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error("Get employee profile error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Change employee password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ success: false, error: "Current password is incorrect" });
        }

        // Check if new password is different from current password
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSame) {
            return res.status(400).json({ success: false, error: "New password must be different from current password" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update employee profile
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        // Find employee using the user reference
        const employee = await Employee.findOne({ userRef: userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Update employee name
        employee.name = name;
        await employee.save();

        // Update user name as well
        const user = await User.findById(userId);
        if (user) {
            user.name = name;
            await user.save();
        }

        // Return updated employee data
        const updatedEmployee = await Employee.findById(employee._id)
            .populate('department', 'dep_name');

        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            data: updatedEmployee
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};