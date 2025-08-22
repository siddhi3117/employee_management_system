import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import connectToDatabase from "./db/db.js";
import employeeRouter from "./routes/employee.js";
import adminRouter from "./routes/admin.js";

console.log("Loading routes...");
console.log("Auth router loaded:", !!authRouter);
console.log("Department router loaded:", !!departmentRouter);
console.log("Employee router loaded:", !!employeeRouter);
console.log("Admin router loaded:", !!adminRouter);

connectToDatabase();
const app = express();

// Set default values for environment variables
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);

console.log("Routes registered successfully");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
