import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import PrivateRoutes from "./Utils/PrivateRoutes";
import RoleBaseRoutes from "./Utils/RoleBaseRoutes";
import AdminSummary from "./Components/dashboard/AdminSummary";
import DepartmentList from "./Components/department/DepartmentList";
import AddDepartment from "./Components/department/AddDepartment";
import EditDepartment from "./Components/department/EditDepartment";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-dashboard" />} />
      <Route path="/login" element={<Login />} />

      {/* Admin dashboard with summary as default route */}
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
        {/* Nested route - shows AdminSummary by default */}
        <Route index element={<AdminSummary />} />
        <Route  path="/admin-dashboard/departments" element={<DepartmentList />} />
        <Route  path="/admin-dashboard/add-department" element={<AddDepartment />} />
        <Route  path="/admin-dashboard/department/:id" element={<EditDepartment />} />
      </Route>

      {/* Employee dashboard route */}
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
    
    </Routes>
  );
}

export default App;
