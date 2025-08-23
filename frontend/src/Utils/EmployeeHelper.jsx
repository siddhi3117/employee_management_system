// Utils/EmployeeHelper.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const employeeColumns = [
  {
    name: "Sr No",
    selector: (row) => row.srno,
    sortable: true,
    width: "80px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
    width: "200px",
  },
];

export const EmployeeButtons = ({ _id }) => {
  return (
    <div className="flex gap-2">
      <Link
        to={`/admin-dashboard/employee/${_id}`}
        className="px-2 py-0.5 bg-gray-600 text-white rounded hover:bg-blue-800"
      >
        Details
      </Link>
      <Link
        to={`/admin-dashboard/edit-employee/${_id}`}
        className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-800"
      >
        Edit
      </Link>
      <button
        className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-800"
        onClick={() =>{
          (async () => {
            await axios.delete(`http://localhost:5000/api/employee/delete/${_id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            window.location.reload();
          })();
        }}
      >
        Delete
      </button>
    </div>
  );
};
