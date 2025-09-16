import { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee"); // Default role for registration
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        navigate("/login"); // ✅ after registration go to login
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div>{user && <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"} replace={true}/>}
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-serif py-1 text-3xl text-white">
        Employee Management System
      </h2>

      <div className="border shadow p-6 w-96 bg-white rounded">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="******"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              className="w-full px-3 py-2 border rounded"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="employee" selected>Employee</option>
            </select>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
            >
              Register
            </button>
          </div>
        </form>

        {/* 👇 Back to login link */}
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600">
            Login
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Registration;
