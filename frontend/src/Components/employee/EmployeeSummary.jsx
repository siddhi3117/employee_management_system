import React, { useEffect, useState } from "react";
import SummaryCard from "../SummaryCard";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const EmployeeSummary = () => {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState({
    leaves_taken: 0,
    leave_pending: 0,
    leave_approved: 0,
    leave_rejected: 0,
    payments_received: 0,
    profile_completion: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/employee/summary",
          {}, // No body needed, employee ID comes from auth token
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = res.data;
        console.log("Employee summary data:", data);
        setSummaryData(data);
      } catch (err) {
        console.error("Error fetching employee summary:", err);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">My Summary</h3>

      {/* Leave Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaCalendarAlt />}
          text="Leaves Taken"
          number={summaryData.leaves_taken}
          color="bg-blue-600"
        />
        <SummaryCard
          icon={<FaCheckCircle />}
          text="Leave Approved"
          number={summaryData.leave_approved}
          color="bg-green-600"
        />
        <SummaryCard
          icon={<FaHourglassHalf />}
          text="Leave Pending"
          number={summaryData.leave_pending}
          color="bg-yellow-600"
        />
        <SummaryCard
          icon={<FaTimesCircle />}
          text="Leave Rejected"
          number={summaryData.leave_rejected}
          color="bg-red-600"
        />
      </div>

      {/* Payments & Profile */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Payments Received"
          number={`₹${summaryData.payments_received}`}
          color="bg-purple-600"
        />
        <SummaryCard
          icon={<FaUser />}
          text="Profile Completion"
          number={`${summaryData.profile_completion}%`}
          color="bg-indigo-600"
        />
      </div>
    </div>
  );
};

export default EmployeeSummary;
