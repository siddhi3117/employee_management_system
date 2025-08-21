// Utils/EmployeeHelper.js

import React from "react";
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
    width: "150px",
  },
];

export const EmployeeButtons = ({ _id }) => {
  return (
    <div className="flex gap-2">
      <Link
        to={`/admin-dashboard/edit-employee/${_id}`}
        className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-800"
      >
        Edit
      </Link>
      <Link
        to={`/admin-dashboard/delete-employee/${_id}`}
        className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-800"
      >
        Delete
      </Link>
    </div>
  );
};
