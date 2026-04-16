import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function AdminPanel() {
    const { token, user, logout } = useAuthStore();

  return (
    <div>
        <div>
        <h1>ADMIN</h1>
            <h2>Panel</h2>
        </div>
        <div>
            <button onClick={logout}>
                <p>odjava</p>
            </button>
        </div>
    </div>

  )
}

