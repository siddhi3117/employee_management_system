import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import api from "../../../api/axiosInstance";
import { employeeColumns, EmployeeButtons } from "../../../Utils/EmployeeHelper";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await api.get("/employee");
        if (response.data.success && Array.isArray(response.data.data)) {
          const data = response.data.data.map((emp, index) => ({
            _id: emp._id,
            srno: index + 1,
            name: emp.name,
            email: emp.email,
            department: emp.department?.dep_name || "N/A",
            action: <EmployeeButtons _id={emp._id} />,
          }));
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          console.log(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      {empLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Employees</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="search by Employee Name"
              className="px-4 py-0.5 border"
            />
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-1 bg-teal-600 rounded text-white hover:bg-teal-800"
            >
              Add New Employee
            </Link>
          </div>
          <div className="mt-5">
            <DataTable columns={employeeColumns} data={employees}  />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
