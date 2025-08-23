import mongoose from "mongoose";

const connectToDatabase = async () => {
    try{
        const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/employee_management";
        console.log("Connecting to database:", MONGODB_URL);
        await mongoose.connect(MONGODB_URL);
        console.log("Database connected successfully");
    } catch(error){
        console.error("Database connection error:", error);
        // Don't throw error, let server continue
    }
}

export default connectToDatabase