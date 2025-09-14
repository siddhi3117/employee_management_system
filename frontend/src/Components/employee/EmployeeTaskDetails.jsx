import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const EmployeeTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/task/${id}`);
        if (response.data.success) {
          setTask(response.data.data);
        } else {
          alert("Task not found");
          navigate("/employee-dashboard/tasks");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        alert("Error fetching task details");
        navigate("/employee-dashboard/tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleStatusUpdate = async (newStatus, notes = "") => {
    try {
      const response = await api.put(`/task/employee/${id}/status`, {
        status: newStatus,
        employeeNotes: notes
      });
      if (response.data.success) {
        setTask(response.data.data);
        alert("Task status updated successfully");
        setShowNotes(false);
        setNotes("");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Error updating task status");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== "completed";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
          <button
            onClick={() => navigate("/employee-dashboard/tasks")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Tasks
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                      OVERDUE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Task Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Task Information</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned By</dt>
                    <dd className="text-sm text-gray-900">{task.assignedBy?.name || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className={`text-sm ${isOverdue(task.dueDate, task.status) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {formatDate(task.dueDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">{formatDate(task.createdAt)}</dd>
                  </div>
                  {task.completedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Completed</dt>
                      <dd className="text-sm text-gray-900">{formatDate(task.completedAt)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Notes & Comments</h4>
                <div className="space-y-4">
                  {task.adminNotes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">Admin Notes</dt>
                      <dd className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                        {task.adminNotes}
                      </dd>
                    </div>
                  )}
                  {task.employeeNotes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">Your Notes</dt>
                      <dd className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                        {task.employeeNotes}
                      </dd>
                    </div>
                  )}
                  {!task.adminNotes && !task.employeeNotes && (
                    <p className="text-sm text-gray-500 italic">No notes available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {task.status !== "completed" && task.status !== "cancelled" && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  {task.status === "pending" && (
                    <button
                      onClick={() => handleStatusUpdate("in_progress")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === "in_progress" && (
                    <button
                      onClick={() => setShowNotes(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Mark as Complete
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const notes = prompt("Add notes (optional):");
                      if (notes !== null) {
                        handleStatusUpdate("in_progress", notes);
                      }
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Add Notes
                  </button>
                </div>

                {showNotes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Completion Notes (optional):
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Describe what was completed, any challenges faced, or additional details..."
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => {
                          setShowNotes(false);
                          setNotes("");
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate("completed", notes);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Complete Task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskDetails;
