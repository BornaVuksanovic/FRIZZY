import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import ClientProfile from './pages/client/clientProfile.jsx';
import MakeAppointment from './pages/client/makeAppointment.jsx';
import { useAuthStore } from './store.js';


export default function App() {
  const { token, user } = useAuthStore();

  return (
    <BrowserRouter>
      {token && user.role == "CLIENT" ? (
        <nav>
          <Link to="/makeAppointment">Rezervacija</Link>    
          <Link to="/clientProfile">Profil</Link>  
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

        <Route path="/clientProfile" element={token ? <ClientProfile /> : <Navigate to="/login" />} />
        <Route path='/makeAppointment' element={token ? <MakeAppointment /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}


