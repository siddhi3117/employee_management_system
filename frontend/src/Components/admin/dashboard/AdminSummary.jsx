import React, { useEffect,useState } from 'react'
import SummaryCard from '../../SummaryCard'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUser, FaUsers } from 'react-icons/fa'
import axios from 'axios'

const AdminSummary = () => {
  const [summaryData, setSummaryData] = useState({
    total_employees: 0,
    total_departments: 0,
    monthly_pay: 0,
    leave_applied: 0,
    leave_approved: 0,
    leave_pending: 0,
    leave_rejected: 0
  });

  useEffect(()=>{
    (async()=>{
      const res = await axios.get('http://localhost:5000/api/admin/adminsummary', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const summaryData = res.data;
      console.log(summaryData);


      // Set state with the fetched data
      setSummaryData(summaryData);
    })()
  }, [])
  return (
    <div className='p-6'>
        <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4  mt-6'>
            <SummaryCard icon={<FaUsers/>} text="Total Employees" number={summaryData.total_employees} color="bg-teal-600"/>
            <SummaryCard icon={<FaBuilding/>} text="Total Departments" number={summaryData.total_departments} color="bg-yellow-600"/>
            <SummaryCard icon={<FaMoneyBillWave/>} text="Monthly Pay" number={`$${summaryData.monthly_pay}`} color="bg-red-600"/>
        </div>
        <div className='mt-12'>
            <h4 className='text-center text=2xl font-bold'>Leave Details</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                 <SummaryCard icon={<FaFileAlt/>} text="Leave Applied" number={summaryData.leave_applied} color="bg-teal-600"/>
                 <SummaryCard icon={<FaCheckCircle/>} text="Leave Approved" number={summaryData.leave_approved} color="bg-green-600"/>
                 <SummaryCard icon={<FaHourglassHalf/>} text="Leave pending" number={summaryData.leave_pending} color="bg-yellow-600"/>
                 <SummaryCard icon={<FaTimesCircle/>} text="Leave Rejected" number={summaryData.leave_rejected} color="bg-red-600"/>
            </div>
        </div>
    </div>
  )
}

export default AdminSummary