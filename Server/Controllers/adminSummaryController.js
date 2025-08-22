import mongoose from "mongoose";

import Department from "../Models/department.js";
import Leave from "../Models/leaves.js";
import Employee from "../Models/employee.js";

export const getAdminSummary = async (req, res) => {
    try {
        const employee = await Employee.countDocuments();
        const department = await Department.countDocuments();
        const monthlyPay = await Employee.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$salary" }
                }
            }
        ]);
        const leaveApplied = await Leave.countDocuments();
        const leaveApproved = await Leave.countDocuments({ status: "approved" });
        const leavePending = await Leave.countDocuments({ status: "pending" });
        const leaveRejected = await Leave.countDocuments({ status: "rejected" });

        const summaryData = {
            total_employees: employee,
            total_departments: department,
            monthly_pay: monthlyPay[0]?.total || 0,
            leave_applied: leaveApplied,
            leave_approved: leaveApproved,
            leave_pending: leavePending,
            leave_rejected: leaveRejected
        };

        res.json(summaryData);
    } catch (error) {
        
    }
}
    
// total_employees: 0,
//     total_departments: 0,
//     monthly_pay: 0,
//     leave_applied: 0,
//     leave_approved: 0,
//     leave_pending: 0,
//     leave_rejected: 0