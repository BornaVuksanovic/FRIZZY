import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import ClientProfile from './pages/client/clientProfile.jsx';
import CreateAppointment from './pages/client/createAppointment.jsx';
import HairdresserProfile from './pages/hairdresser/hairdresserProfile.jsx';
import HairdresserDashboard from './pages/hairdresser/hairdresserDashboard.jsx';
import AdminPanel from './pages/admin/adminPanel.jsx';
import CreateHairdresser from './pages/admin/createHairdresser.jsx';
import CreateService from './pages/admin/createService.jsx';
import { useAuthStore } from './store.js';
import { Toaster } from "react-hot-toast";
import { ClipLoader } from 'react-spinners';


export default function App() {
  const { token, user, checkStore, isLoading } = useAuthStore();



  useEffect(()=>{
    checkStore();
  },[])

  if( isLoading ){
    return <ClipLoader />
  } 

  return (
    <>
    <BrowserRouter>
      {token && user.role == "CLIENT" ? (
        <nav>
          <Link to="/makeAppointment">Rezervacija</Link>    
          <Link to="/clientProfile">Profil</Link>  
        </nav>
        )
        : token && user.role == "HAIRDRESSER" ? 
        (
        <nav>
          <Link to="/hairdresserDashboard">Nadzorna Ploča</Link>    
          <Link to="/hairdresserProfile">Profil</Link>  
        </nav>       
        )
        : token && user.role == "ADMIN" ?
        (
        <nav>
          <Link to="/createService">Kreiraj uslugu</Link>    
          <Link to="/createHairdresser">Kreiraj Račun Radniku</Link>
          <Link to="/adminPanel">Nadzorna Ploča</Link>     
        </nav>           
        )
        :
        (
        <nav>
          <Link to="/">Početna</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>      
        </nav>          
        )
      }


      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route path="/clientProfile" element={token && user.role == "CLIENT" ? <ClientProfile /> : <Navigate to="/login" />} />
        <Route path='/createAppointment' element={token && user.role == "CLIENT" ? <CreateAppointment /> : <Navigate to="/login" />} />

        <Route path="/hairdresserProfile" element={token && user.role == "HAIRDRESSER" ? <HairdresserProfile /> : <Navigate to="/login" />} />
        <Route path='/hairdresserDashboard' element={token && user.role == "HAIRDRESSER" ? <HairdresserDashboard /> : <Navigate to="/login" />} />

        <Route path='/adminPanel' element={token && user.role == "ADMIN" ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path='/createHairdresser' element={token && user.role == "ADMIN" ? <CreateHairdresser /> : <Navigate to="/login" />} /> 
        <Route path='/createService' element={token && user.role == "ADMIN" ? <CreateService /> : <Navigate to="/login" />} /> 
                
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


