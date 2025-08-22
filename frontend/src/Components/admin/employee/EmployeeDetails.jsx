import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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

  return (
    <div className="p-5 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow rounded p-6">
        <h3 className="text-2xl font-bold text-center mb-5">Employee Details</h3>

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
            <p className="text-lg">
              {employee.department?.dep_name || "N/A"}
            </p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Total Leaves:</span>
            <p className="text-lg">{employee.total_leaves}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Currently On Leave:</span>
            <p
              className={`text-lg font-semibold ${
                employee.onleave ? "text-red-600" : "text-green-600"
              }`}
            >
              {employee.onleave ? "Yes" : "No"}
            </p>
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
                      <td className="border p-2 capitalize">{leave.leaveType}</td>
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
