import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    department:{type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    salary:{type: Number, required: true},
    profileImage:{type: String},
    userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Reference to User
    total_leaves:{type: Number, default: 0},
    leaveHistory:[{
        leaveType:{type: String, enum:["sick","casual","earned"], required: true},
        fromDate:{type: Date, required: true},
        toDate:{type: Date, required: true},
        status:{type: String, enum:["approved","pending","rejected"], default: "pending"}
    }],
    onleave:{type: Boolean, default: false},
    attendance: [
    {
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["Present", "Absent", "Leave"],
        default: "Present",
      },
    },
  ],
})



const Employee = mongoose.model("Employee", employeeSchema)
export default Employee;