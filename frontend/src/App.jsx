import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import ClientProfile from './pages/clientProfile.jsx';
import { useAuthStore } from './store.js';


export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
    {token ? (
      <nav>
        <Link to="/clientProfile">Profil</Link>     
      </nav>
      )
      :
      (
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>      
      </nav>        
      )
  }
    
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/clientProfile" element={token ? <ClientProfile /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}


