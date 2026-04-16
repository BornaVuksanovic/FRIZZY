import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ClientProfile() {
    const { token, user, logout } = useAuthStore();
    const navigate = useNavigate();


    if (!user) return null;

    return (
        <div>
            <div>
                <h1>Profil {user.username}</h1>
                <p>Ime: {user.firstName}</p>
                <p>Prezime: {user.lastName}</p>
                <p>Broj telefona: {user.phoneNumber}</p>
            </div>
            <div>
                <button onClick={logout}>
                    <p>odjava</p>
                </button>
            </div>
            
        </div>

    )
}

