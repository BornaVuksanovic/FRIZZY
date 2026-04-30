import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

    useEffect(()=>{
        if( user?.role == "CLIENT"){
            navigate("/createAppointment");
        }    
        else if(user?.role == "HAIRDRESSER"){
            navigate("/hairdresserDashboard");
        }
        else if(user?.role == "ADMIN"){
            navigate("/adminPanel");
        }
    }, [user]);

  return (
    
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-indigo-600  mb-4">
          FRIZZY
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-600 font-medium  mb-10">
          Rezervacija termina za modernu frizuru 
            <br className="hidden md:block" /> 
          u samo par klikova.
        </h2>
        <button 
          onClick={() => navigate("/login")}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600  rounded-2xl  hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-95"
          >
            Rezerviraj termin
        </button>
        <p className="mt-6 text-sm text-slate-400 font-medium">
          Pridruži se stotinama zadovoljnih klijenata
        </p>

      </div>
    </main>
  )
}

export default Home
