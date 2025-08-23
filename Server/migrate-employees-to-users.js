import mongoose from "mongoose";
import Employee from "./Models/employee.js";
import User from "./Models/User.js";
import bcrypt from "bcrypt";
import connectToDatabase from "./db/db.js";

const migrateEmployeesToUsers = async () => {
    try {
        await connectToDatabase();
        console.log("Connected to database");

        // Find all employees that don't have a userRef
        const employeesWithoutUsers = await Employee.find({ userRef: { $exists: false } });
        console.log(`Found ${employeesWithoutUsers.length} employees without user accounts`);

        for (const employee of employeesWithoutUsers) {
            try {
                // Check if user already exists with this email
                const existingUser = await User.findOne({ email: employee.email });
                if (existingUser) {
                    console.log(`User already exists for employee ${employee.name} (${employee.email})`);
                    // Update employee with existing user reference
                    employee.userRef = existingUser._id;
                    await employee.save();
                    continue;
                }

                // Generate default password
                const defaultPassword = "employee123";
                const hashedPassword = await bcrypt.hash(defaultPassword, 10);

                // Create user account
                const newUser = new User({
                    name: employee.name,
                    email: employee.email,
                    password: hashedPassword,
                    role: "employee",
                    employeeRef: employee._id
                });
                await newUser.save();

                // Update employee with user reference
                employee.userRef = newUser._id;
                await employee.save();

                console.log(`Created user account for employee ${employee.name} (${employee.email}) with password: ${defaultPassword}`);
            } catch (error) {
                console.error(`Error creating user for employee ${employee.name}:`, error.message);
            }
        }

        console.log("Migration completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

// Run the migration
migrateEmployeesToUsers();
