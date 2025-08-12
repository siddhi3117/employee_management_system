import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import connectToDatabase from "./db/db.js";

connectToDatabase();
const app = express();


app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
