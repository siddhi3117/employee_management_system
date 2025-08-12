import React from 'react'
import { useAuth } from '../context/authContext'
import AdminSidebar from '../Components/dashboard/AdminSidebar'
import Navbar from '../Components/dashboard/Navbar'
import AdminSummary from '../Components/dashboard/AdminSummary'
import { Outlet } from 'react-router-dom'


const AdminDashboard = () => {
  const {user}=useAuth()
  return (
    <div className='flex'>
      <AdminSidebar/>
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
       <Navbar/>
       <Outlet/>
    </div>
    </div>
  )
}

export default AdminDashboard
