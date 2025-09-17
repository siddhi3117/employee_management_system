import React, { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const response = await api.get("/employee/leaves");

        if (response.data.success) {
          // Sort leaves: pending first, then by creation date (newest first)
          const sortedLeaves = response.data.data.sort((a, b) => {
            // First sort by status: pending comes first
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;
            
            // If both have same status, sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          
          setLeaves(sortedLeaves);
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
      const endpoint = newStatus === "approved" ? "approve" : "reject";
      const response = await api.post(
        `/employee/leave/${leaveId}/${endpoint}`,
        {}
      );

      if (response.data.success) {
        alert(`Leave ${newStatus} successfully!`);
        // Refresh the leaves data to get updated sorting
        const refreshResponse = await api.get("/employee/leaves");

        if (refreshResponse.data.success) {
          // Sort leaves: pending first, then by creation date (newest first)
          const sortedLeaves = refreshResponse.data.data.sort((a, b) => {
            // First sort by status: pending comes first
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;
            
            // If both have same status, sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          
          setLeaves(sortedLeaves);
        }
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

  // Calculate leave statistics
  const pendingCount = leaves.filter(leave => leave.status === "pending").length;
  const approvedCount = leaves.filter(leave => leave.status === "approved").length;
  const rejectedCount = leaves.filter(leave => leave.status === "rejected").length;

  const refreshLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employee/leaves");

      if (response.data.success) {
        // Sort leaves: pending first, then by creation date (newest first)
        const sortedLeaves = response.data.data.sort((a, b) => {
          // First sort by status: pending comes first
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          
          // If both have same status, sort by creation date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setLeaves(sortedLeaves);
      }
    } catch (error) {
      console.error("Error refreshing leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">
          Leave Applications
        </h2>
        <button
          onClick={refreshLeaves}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <div className="text-yellow-600 text-3xl">⏳</div>
          </div>
        </div>
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
            </div>
            <div className="text-green-600 text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
            </div>
            <div className="text-red-600 text-3xl">❌</div>
          </div>
        </div>
      </div>

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
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className={`${leave.status === "pending" ? "bg-yellow-50" : ""}`}>
                <td className="border p-2 font-medium">{leave.name}</td>
                <td className="border p-2">{leave.email}</td>
                <td className="border p-2">{leave.department}</td>
                <td className="border p-2 capitalize">{leave.leaveType}</td>
                <td className="border p-2">
                  {new Date(leave.fromDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(leave.toDate).toLocaleDateString()}
                </td>
                <td className="border p-2 max-w-xs truncate" title={leave.reason || "No reason provided"}>
                  {leave.reason || "No reason provided"}
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    leave.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : leave.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {leave.status}
                  </span>
                </td>
                <td className="border p-2">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleAction(leave.employeeId, leave._id, "approved")
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleAction(leave.employeeId, leave._id, "rejected")
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
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
