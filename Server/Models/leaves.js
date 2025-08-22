import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // link to Employee model
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["sick", "casual", "earned"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    reason: {
      type: String, // optional: employee can specify why
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
