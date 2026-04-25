import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api.js";


export default function HairdresserDashboard() {
  const { token, user } = useAuthStore();
  const [today, setToday] = useState(new Date());

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await api.get("/api/app/getHairdresserAppointments",{
          params: {
            hairdresserId: user.id,
            date: today.toISOString(),
            type: 'today'
          },
          
          headers: {
            Authorization: `Bearer ${token}`
          }
          
      });
      return response.data.appointments
    },
    
    onError: (error) => {
      console.error("Appointment fetch failed", error.message);
      toast.error('Neuspješno dohvacanje appointmenta');
    },
    
    enabled: () => {
     !!user  // Pokreni tek kad imamo frizera 
    }
    
  });

  const appointments = appointmentsQuery.data;

  const isLoading = appointmentsQuery.isLoading || !user;

    if (isLoading) {
      return (
          <div>
              <ClipLoader loading={isLoading} size={50} color={"#3498db"} />
          </div>
      );
    }

return (
  <div className="min-h-screen bg-slate-50 py-10 px-4">
    <div className="max-w-2xl mx-auto">
      
      {/* HEADER: Današnji datum */}
      <div className="mb-8 flex flex-col items-center text-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            DANAŠNJI RASPORED
          </h1>
          <p className="text-slate-800 font-medium mt-1 text-2xl">
            {today.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* LISTA TERMINA */}
      <div className="space-y-3">
        {appointments?.length > 0 ? (
          appointments.map((app) => (
            <div 
              key={app.id} 
              className="flex items-center gap-4 bg-white p-2 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group"
            >
              {/* Vrijeme - LIJEVA STRANA */}
              <div className="bg-indigo-600 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                <span className="text-xl font-black">
                  {new Date(app.startDate).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Informacije - DESNA STRANA */}
              <div className="flex-1 pr-4 py-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h3 className="text-lg font-black text-indigo-800 ">
                      {app.service.name}
                    </h3>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      {app.client.firstName} {app.client.lastName}
                    </p>
                  </div>
                  
                  <div className="mt-2 md:mt-0 text-left md:text-right border-t md:border-t-0 border-slate-50 pt-2 md:pt-0">
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mb-0.5 mr-2">Kontakt</p>
                    <p className="text-xs  font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg inline-block">
                      {app.client.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Danas nemaš nijednu rezervaciju.</p>
          </div>
        )}
      </div>

    </div>
  </div>
);
}


