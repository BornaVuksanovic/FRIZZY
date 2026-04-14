import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import { useAuthStore } from './store.js';


export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}


