import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import EmployeeList from "./Components/admin/employee/EmployeeList";
import EmployeeDetails from "./Components/admin/employee/EmployeeDetails";
import EmployeeSummary from "./Components/employee/EmployeeSummary";
import AddEmployee from "./Components/admin/employee/AddEmployee";
import EditEmployee from "./Components/admin/employee/EditEmployee";
import LeavesPage from "./Components/admin/leaves/LeavesPage";
import ELeavesPage from "./Components/employee/ELeavesPage";
import LeaveDetails from "./Components/admin/leaves/LeaveDeatils";
import PrivateRoutes from "./Utils/PrivateRoutes";
import RoleBaseRoutes from "./Utils/RoleBaseRoutes";
import SettingsPage from "./Components/admin/dashboard/SettingsPage";
import EmployeeSettingsPage from "./Components/employee/SettingsPage";
import AdminSummary from "./Components/admin/dashboard/AdminSummary";
import DepartmentList from "./Components/admin/department/DepartmentList";
import AddDepartment from "./Components/admin/department/AddDepartment";
import EditDepartment from "./Components/admin/department/EditDepartment";
import DeleteDepartment from "./Components/admin/department/DeleteDepartment";
import Register from "./Pages/Registration";
// Task components
import TaskList from "./Components/admin/tasks/TaskList";
import CreateTask from "./Components/admin/tasks/CreateTask";
import EditTask from "./Components/admin/tasks/EditTask";
import TaskDetails from "./Components/admin/tasks/TaskDetails";
import EmployeeTasksPage from "./Components/employee/EmployeeTasksPage";
import EmployeeTaskDetails from "./Components/employee/EmployeeTaskDetails";

function App() {
  // ✅ Object list for admin child routes
  const adminRoutes = [
    { path: "", element: <AdminSummary /> }, // index route
    { path: "departments", element: <DepartmentList /> },
    { path: "add-department", element: <AddDepartment /> },
    { path: "department/:id", element: <EditDepartment /> },
    { path: "department/delete/:id", element: <DeleteDepartment /> },
    { path: "employees", element: <EmployeeList /> },
    { path: "employee/:id", element: <EmployeeDetails /> },
    { path: "add-employee", element: <AddEmployee /> },
    { path: "edit-employee/:id", element: <EditEmployee /> },
    { path: "leaves", element: <LeavesPage /> },
    { path: "leave/:id", element: <LeaveDetails /> },
    { path: "tasks", element: <TaskList /> },
    { path: "tasks/create", element: <CreateTask /> },
    { path: "tasks/edit/:id", element: <EditTask /> },
    { path: "tasks/:id", element: <TaskDetails /> },
    { path: "settings", element: <SettingsPage /> },
  ];

  const employeeRoutes = [
    { path: "", element: <EmployeeSummary /> }, // index route
    { path: "leaves", element: <ELeavesPage /> },
    { path: "tasks", element: <EmployeeTasksPage /> },
    { path: "tasks/:id", element: <EmployeeTaskDetails /> },
    { path: "settings", element: <EmployeeSettingsPage /> },
  ];

  return (
    <Routes>
      {/* Default route → go to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/registration" element={<Register />} />

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
        {adminRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Employee dashboard (protected) */}
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["employee"]}>
              <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        {employeeRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
