import React, { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { useAuth } from "../../../context/authContext";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
  });

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        profileImage: user.profileImage || "",
      });
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(
        "/auth/update",
        formData
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        setUser(res.data.user);
      } else {
        alert(res.data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>

      {user && (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-4 bg-white p-5 shadow rounded-lg"
        >
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Profile Image (URL)</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {formData.profileImage && (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full mt-2"
            />
          )}

          <div>
            <label className="block mb-1">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
