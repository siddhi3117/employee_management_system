import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import EmployeeList from "./Components/employee/EmployeeList";
import EmployeeDetails from "./Components/employee/EmployeeDetails";
import AddEmployee from "./Components/employee/AddEmployee";
import LeavesPage from "./Components/leaves/LeavesPage";
import LeaveDetails from "./Components/leaves/LeaveDeatils";
import PrivateRoutes from "./Utils/PrivateRoutes";
import RoleBaseRoutes from "./Utils/RoleBaseRoutes";
import AdminSummary from "./Components/dashboard/AdminSummary";
import DepartmentList from "./Components/department/DepartmentList";
import AddDepartment from "./Components/department/AddDepartment";
import EditDepartment from "./Components/department/EditDepartment";
import DeleteDepartment from "./Components/department/DeleteDepartment";
import Register from "./Pages/Registration";

function App() {
  return (
    <Routes>
      {/* Default route → go to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/registration" element={<Register />} /> {/* ✅ Now outside */}
      {/* Admin dashboard (protected) */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<AdminSummary />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="department/:id" element={<EditDepartment />} />
        <Route path="department/delete/:id" element={<DeleteDepartment />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employee/:id" element={<EmployeeDetails />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="leave/:id" element={<LeaveDetails />} />
      </Route>
      {/* Employee dashboard (protected) */}
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}

export default App;
