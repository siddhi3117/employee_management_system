import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [approvedLeaveDays, setApprovedLeaveDays] = useState(0);
  const navigate = useNavigate();

  // Calculate attendance statistics for selected month
  const calculateAttendanceStats = (month, year) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    // Calculate total working days (excluding weekends)
    let totalWorkingDays = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude Sunday (0) and Saturday (6)
        totalWorkingDays++;
      }
    }

    // Calculate present days using backend-approved leave days
    const totalPresentDays = Math.max(totalWorkingDays - approvedLeaveDays, 0);

    return {
      totalWorkingDays,
      totalLeaveDays: approvedLeaveDays,
      totalPresentDays,
    };
  };

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/employee/${id}`);

        if (response.data.success) {
          setEmployee(response.data.data);
        } else {
          alert("Employee not found");
          navigate("/admin-dashboard/employee-list");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        alert("Error fetching employee details");
        navigate("/admin-dashboard/employee-list");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  // Fetch approved leave days for selected month/year from backend
  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/employee/${id}/approved-leaves`, {
          params: { month: selectedMonth, year: selectedYear }
        });
        if (res.data?.success) {
          setApprovedLeaveDays(res.data.data?.totalLeaveDays || 0);
        } else {
          setApprovedLeaveDays(0);
        }
      } catch (err) {
        console.error("Error fetching approved leaves:", err);
        setApprovedLeaveDays(0);
      }
    };
    fetchApprovedLeaves();
  }, [id, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Loading employee details...</p>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  const attendanceStats = calculateAttendanceStats(selectedMonth, selectedYear);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-5 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow rounded p-6">
        <h3 className="text-2xl font-bold text-center mb-5">
          Employee Details
        </h3>

        {/* Profile Image */}
        {employee.profileImage && (
          <div className="flex justify-center mb-5">
            <img
              src={employee.profileImage}
              alt={employee.name}
              className="w-32 h-32 rounded-full object-cover border shadow"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <span className="block text-gray-600 font-medium">Name:</span>
            <p className="text-lg">{employee.name}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Email:</span>
            <p className="text-lg">{employee.email}</p>
          </div>
          <div>
            <span className="block text-gray-600 font-medium">Salary:</span>
            <p className="text-lg">${employee.salary}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Department:</span>
            <p className="text-lg">{employee.department?.dep_name || "N/A"}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">
              Total Leaves:
            </span>
            <p className="text-lg">{employee.total_leaves}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">
              Currently On Leave:
            </span>
            <p
              className={`text-lg font-semibold ${
                employee.onleave ? "text-red-600" : "text-green-600"
              }`}
            >
              {employee.onleave ? "Yes" : "No"}
            </p>
          </div>

          {/* Attendance Statistics */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xl font-semibold mb-4">Attendance Statistics</h4>
            
            {/* Month/Year Selector */}
            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month:</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="text-sm font-medium text-gray-500 mb-1">Total Working Days</h5>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalWorkingDays}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="text-sm font-medium text-gray-500 mb-1">Approved Leaves</h5>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.totalLeaveDays}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h5 className="text-sm font-medium text-gray-500 mb-1">Present Days</h5>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.totalPresentDays}</p>
                <p className="text-xs text-gray-500">
                  (Working Days - Approved Leaves)
                </p>
              </div>
            </div>

            {/* Attendance Percentage */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h5 className="text-sm font-medium text-gray-500 mb-1">Attendance Rate</h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${attendanceStats.totalWorkingDays > 0 ? (attendanceStats.totalPresentDays / attendanceStats.totalWorkingDays) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {attendanceStats.totalWorkingDays > 0 
                    ? Math.round((attendanceStats.totalPresentDays / attendanceStats.totalWorkingDays) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>

        {/* Leave History */}
          <div>
            <span className="block text-gray-600 font-medium mb-2">
              Leave History:
            </span>
            {employee.leaveHistory?.length > 0 ? (
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Leave Type</th>
                    <th className="border p-2">From</th>
                    <th className="border p-2">To</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.leaveHistory.map((leave, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 capitalize">
                        {leave.leaveType}
                      </td>
                      <td className="border p-2">
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td
                        className={`border p-2 font-semibold ${
                          leave.status === "approved"
                            ? "text-green-600"
                            : leave.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {leave.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No leave history available.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>

          <button
            onClick={() =>
              navigate(`/admin-dashboard/edit-employee/${employee._id}`)
            }
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
          >
            Edit
          </button>
        

      
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
