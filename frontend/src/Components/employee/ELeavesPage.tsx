import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";

const ELeavesPage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<{ [month: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "sick",
    reason: "",
  });

  // Fetch leaves
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/employee/getleaves",
          { employeeId: user?._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Group leaves by month
        const grouped: { [month: string]: any[] } = {};
        (res.data.data || []).forEach((leave: any) => {
          const month = new Date(leave.fromDate).toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          if (!grouped[month]) grouped[month] = [];
          grouped[month].push(leave);
        });
        
        setLeaves(grouped);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setLoading(false);
      }
    })();
  }, [user]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new leave
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/employee/addleave",
        { ...formData, employee: user?._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Leave request submitted!");
      setShowForm(false);
      window.location.reload(); // refresh list
    } catch (err) {
      console.error("Error applying for leave:", err);
      alert("Failed to apply for leave");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <FaCalendarAlt /> My Leaves
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaPlus /> Apply for Leave
        </button>
      </div>

      {/* Leaves grouped by month */}
      <div className="mt-8 space-y-8">
        {Object.keys(leaves).length === 0 ? (
          <p className="text-gray-600">No leaves found.</p>
        ) : (
          Object.entries(leaves).map(([month, monthLeaves]) => (
            <div key={month}>
              <h4 className="text-xl font-semibold mb-4">{month}</h4>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">From</th>
                      <th className="p-3 text-left">To</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Reason</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthLeaves.map((leave: any, idx: number) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {new Date(leave.toDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 capitalize">{leave.leaveType}</td>
                        <td className="p-3">{leave.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              leave.status === "approved"
                                ? "bg-green-600"
                                : leave.status === "pending"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Apply Leave */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="sick">Sick</option>
                  <option value="casual">Casual</option>
                  <option value="earned">Earned</option>
                </select>
              </div>
              <div>
                <label className="block font-medium">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Enter reason for leave"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ELeavesPage;
