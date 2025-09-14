import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosInstance";

const EditEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch employee data and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee data
        const employeeResponse = await api.get(`/employee/${id}`);

        if (employeeResponse.data.success) {
          const emp = employeeResponse.data.data;
          setName(emp.name);
          setEmail(emp.email);
          setDepartment(emp.department._id);
          setSalary(emp.salary);
        }

        // Fetch departments
        const departmentResponse = await api.get("/department");

        if (departmentResponse.data.success) {
          setDepartments(departmentResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading employee data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put(
        `/employee/update/${id}`,
        {
          name,
          email,
          department,
          salary,
        }
      );

      if (response.data.success) {
        alert("Employee updated successfully!");
        navigate("/admin-dashboard/employees");
      } else {
        alert("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error updating employee");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-5 flex justify-center">
        <div className="text-center">Loading employee data...</div>
      </div>
    );
  }

  return (
    <div className="p-5 flex justify-center">
      <div className="w-full max-w-lg bg-white shadow rounded p-6">
        <h3 className="text-2xl font-bold text-center mb-5">Edit Employee</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter employee name"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter employee email"
            />
          </div>

          <div>
            <label className="block font-medium">Salary</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter employee salary"
            />
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/employees")}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-800"
            >
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
