import React, { useEffect, useState } from "react";
import axios from "axios";

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all employees and their leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/employee/leaves", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          // Flatten employee leave history into a list
          const allLeaves = [];
          response.data.data.forEach((emp) => {
            emp.leaveHistory.forEach((leave) => {
              allLeaves.push({
                _id: leave._id,
                employeeId: emp._id,
                name: emp.name,
                email: emp.email,
                department: emp.department?.dep_name || "N/A",
                leaveType: leave.leaveType,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                status: leave.status,
              });
            });
          });
          setLeaves(allLeaves);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Handle Approve / Reject
  const handleAction = async (employeeId, leaveId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${employeeId}/leave/${leaveId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Leave ${newStatus} successfully!`);
        // update state locally
        setLeaves((prev) =>
          prev.map((l) =>
            l._id === leaveId ? { ...l, status: newStatus } : l
          )
        );
      } else {
        alert("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave:", error);
      alert("Error updating leave");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Loading leave applications...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5 text-center">
        Leave Applications
      </h2>

      {leaves.length === 0 ? (
        <p className="text-center">No leave applications found.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Employee</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Leave Type</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td className="border p-2">{leave.name}</td>
                <td className="border p-2">{leave.email}</td>
                <td className="border p-2">{leave.department}</td>
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
                <td className="border p-2">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleAction(leave.employeeId, leave._id, "approved")
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleAction(leave.employeeId, leave._id, "rejected")
                        }
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-800"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeavesPage;
