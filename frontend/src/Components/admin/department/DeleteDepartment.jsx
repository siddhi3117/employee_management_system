import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosInstance";

const DeleteDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    try {
      await api.delete(`/api/department/${id}`);
      alert("Department deleted successfully!");
      navigate("/admin-dashboard/department");
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Delete Department
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete this department? This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="w-1/2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/department")}
            className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepartment;
