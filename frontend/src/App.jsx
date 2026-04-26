import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ClientProfile from './pages/client/clientProfile.jsx';
import CreateAppointment from './pages/client/createAppointment.jsx';
import HairdresserProfile from './pages/hairdresser/hairdresserProfile.jsx';
import HairdresserDashboard from './pages/hairdresser/hairdresserDashboard.jsx';
import AdminPanel from './pages/admin/adminPanel.jsx';
import CreateHairdresser from './pages/admin/createHairdresser.jsx';
import CreateService from './pages/admin/createService.jsx';
import HairdresserSchedule from './pages/hairdresser/hairdresserSchedule.jsx';
import FutureAppointments from './pages/admin/futureApps.jsx';
import PastAppointments from './pages/admin/pastApps.jsx';
import TodayAppointments from './pages/admin/todayApps.jsx';
import { useAuthStore } from './store.js';
import { Toaster } from "react-hot-toast";
import { ClipLoader } from 'react-spinners';
import Navbar from './Navbar.jsx';


export default function App() {
  const { token, user, checkStore, isCheckingAuth } = useAuthStore();



  useEffect(()=>{
    checkStore();
  },[])

  if( isCheckingAuth ){
    return <ClipLoader />
  } 

  return (
    <>
    <BrowserRouter>
      <Navbar user={user} token={token}/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route path="/clientProfile" element={token && user.role == "CLIENT" ? <ClientProfile /> : <Navigate to="/login" />} />
        <Route path='/createAppointment' element={token && user.role == "CLIENT" ? <CreateAppointment /> : <Navigate to="/login" />} />

        <Route path="/hairdresserProfile" element={token && user.role == "HAIRDRESSER" ? <HairdresserProfile /> : <Navigate to="/login" />} />
        <Route path='/hairdresserDashboard' element={token && user.role == "HAIRDRESSER" ? <HairdresserDashboard /> : <Navigate to="/login" />} />
        <Route path='/hairdresserSchedule' element={token && user.role == "HAIRDRESSER" ? <HairdresserSchedule /> : <Navigate to="/login" />} />

        <Route path='/adminPanel' element={token && user.role == "ADMIN" ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path='/createHairdresser' element={token && user.role == "ADMIN" ? <CreateHairdresser /> : <Navigate to="/login" />} /> 
        <Route path='/createService' element={token && user.role == "ADMIN" ? <CreateService /> : <Navigate to="/login" />} /> 
        <Route path='/futureAppointments' element={token && user.role == "ADMIN" ? <FutureAppointments /> : <Navigate to="/login" />} /> 
        <Route path='/pastAppointments' element={token && user.role == "ADMIN" ? <PastAppointments /> : <Navigate to="/login" />} />         
        <Route path='/todayAppointments' element={token && user.role == "ADMIN" ? <TodayAppointments /> : <Navigate to="/login" />} />  

      </Routes>
    </BrowserRouter>

    <Toaster 
      position='top-right'
      toastOptions={{
        style: {
          fontSize: '24px',
          padding: '20px',
          width: '400px',
          height: '100px'
        },
        success: {
          duration: 3000,
          style: {
              background: '#ecfdf5', 
              border: '1px solid #10b981',
          }
        },
        error: {
          duration: 3000,
          style: {
              background: '#fef2f2',
              border: '1px solid #ef4444',
          }
        }
      }}
    />
    </>
    
  )
}


