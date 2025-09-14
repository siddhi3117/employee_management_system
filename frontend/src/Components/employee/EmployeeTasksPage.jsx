import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { FaFilter, FaEye, FaEdit } from "react-icons/fa";

const EmployeeTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    status: "",
    priority: ""
  });
  const navigate = useNavigate();

  // Fetch tasks and stats
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tasks
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);

      const tasksResponse = await api.get(`/task/employee/my-tasks?${params.toString()}`);
      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data);
      }

      // Fetch stats
      const statsResponse = await api.get("/task/employee/stats");
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleStatusUpdate = async (taskId, newStatus, notes = "") => {
    try {
      const response = await api.put(`/task/employee/${taskId}/status`, {
        status: newStatus,
        employeeNotes: notes
      });
      if (response.data.success) {
        fetchData(); // Refresh data
        alert("Task status updated successfully");
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
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== "completed";
  };

  const TaskCard = ({ task }) => {
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState("");

    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
          </div>
          <div className="flex space-x-2 ml-4">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Due Date:</span>
            <span className={`ml-1 ${isOverdue(task.dueDate, task.status) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
              {formatDate(task.dueDate)}
              {isOverdue(task.dueDate, task.status) && " (Overdue)"}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Assigned by:</span>
            <span className="ml-1 text-gray-900">{task.assignedBy?.name || "N/A"}</span>
          </div>
        </div>

        {task.adminNotes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Admin Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{task.adminNotes}</p>
          </div>
        )}

        {task.employeeNotes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Your Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{task.employeeNotes}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {task.status === "pending" && (
              <button
                onClick={() => handleStatusUpdate(task._id, "in_progress")}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Start Task
              </button>
            )}
            {task.status === "in_progress" && (
              <button
                onClick={() => {
                  setShowNotes(true);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Mark Complete
              </button>
            )}
            {task.status !== "completed" && (
              <button
                onClick={() => {
                  const notes = prompt("Add notes (optional):");
                  if (notes !== null) {
                    handleStatusUpdate(task._id, "in_progress", notes);
                  }
                }}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                Add Notes
              </button>
            )}
          </div>
          <button
            onClick={() => navigate(`/employee-dashboard/tasks/${task._id}`)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEye />
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
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Describe what was completed..."
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNotes("");
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(task._id, "completed", notes);
                  setShowNotes(false);
                  setNotes("");
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Complete Task
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Tasks</h2>
        <p className="text-gray-600">Manage and track your assigned tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
          <div className="text-sm text-gray-500">Total Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress || 0}</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.completed || 0}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4 mb-4">
          <FaFilter className="text-gray-500" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({...filter, priority: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilter({status: "", priority: ""})}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTasksPage;
