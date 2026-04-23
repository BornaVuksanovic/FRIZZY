import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function HairdresserProfile() {
    const { token, user, logout } = useAuthStore();
    const navigate = useNavigate();


    if (!user) return null;

    return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            
            <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold text-indigo-600 uppercase tracking-widest mb-1">Profil</h1>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {user.firstName} {user.lastName}
                </h2>
                <div className="mt-4 flex items-center gap-2 text-slate-500 font-medium">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md uppercase text-slate-400">Tel</span>
                {user.phoneNumber}
                </div>
            </div>
            
            <button 
                onClick={logout}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all active:scale-95 text-sm"
            >
                Odjavi se
            </button>
            </div>
        </div>
        </div>
    </div>

    )
}

