import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";

const LeaveDetails = () => {
  const { id } = useParams(); // leaveId from URL
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch leave details
  useEffect(() => {
    const fetchLeave = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/employee/leave/${id}`
        );

        if (response.data.success) {
          setLeave(response.data.data);
        } else {
          alert("Leave not found");
          navigate("/admin-dashboard/leaves");
        }
      } catch (error) {
        console.error("Error fetching leave:", error);
        alert("Error fetching leave");
        navigate("/admin-dashboard/leaves");
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Loading leave details...</p>
      </div>
    );
  }

  if (!leave) {
    return null;
  }

  return (
    <div className="p-5 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow rounded p-6">
        <h3 className="text-2xl font-bold text-center mb-5">Leave Details</h3>

        <div className="space-y-4">
          <div>
            <span className="block text-gray-600 font-medium">Employee:</span>
            <p className="text-lg">{leave.employee?.name || "N/A"}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Email:</span>
            <p className="text-lg">{leave.employee?.email || "N/A"}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Department:</span>
            <p className="text-lg">{leave.employee?.department?.dep_name || "N/A"}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Leave Type:</span>
            <p className="text-lg capitalize">{leave.leaveType}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">From:</span>
            <p className="text-lg">
              {new Date(leave.fromDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">To:</span>
            <p className="text-lg">
              {new Date(leave.toDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Reason:</span>
            <p className="text-lg">{leave.reason || "Not provided"}</p>
          </div>

          <div>
            <span className="block text-gray-600 font-medium">Status:</span>
            <p
              className={`text-lg font-semibold ${
                leave.status === "approved"
                  ? "text-green-600"
                  : leave.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {leave.status}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate("/admin-dashboard/leaves")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>

          {leave.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await api.put(
                    `/api/employee/leave/${leave._id}/approve`,
                    {}
                  );
                  alert("Leave approved!");
                  navigate("/admin-dashboard/leaves");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  await api.put(
                    `/api/employee/leave/${leave._id}/reject`,
                    {}
                  );
                  alert("Leave rejected!");
                  navigate("/admin-dashboard/leaves");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
