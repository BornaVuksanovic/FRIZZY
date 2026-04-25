import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api.js";


export default function HairdresserSchedule() {
  const { token, user } = useAuthStore();
  const [today, setToday] = useState(new Date());

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await api.get("/api/app/getHairdresserAppointments",{
          params: {
            hairdresserId: user.id,
            date: today,
            type: 'upcoming' 
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

  const groupedAppointments = appointments?.reduce((acc, app) => {
    const dateKey = new Date(app.startDate).toLocaleDateString('hr-HR');

    if( !acc[dateKey]) {
      acc[dateKey]= [];
    }

    acc[dateKey].push(app);

    return acc;
  },{}); // {} početna vrijednost

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
    <div className="max-w-3xl mx-auto">
      
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black border-b pb-6 border-slate-200 mb-5 text-slate-900 ">
          BUDUĆI TERMINI
        </h1>
      </div>

      <div className="space-y-10">
        {appointments?.length > 0 ? (
          Object.entries(groupedAppointments).map(([date, apps]) => (
            <div key={date} >
              
              {/*datum*/}
              <div className=" top-20 z-10 mb-4">
                <h3 className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm font-bold shadow-md">
                  {date}
                </h3>
              </div>

              {/* Lista termina za taj datum */}
              <div className="grid gap-4 ml-2  border-indigo-100 pl-6 py-2">
                {apps.map(app => (
                  <div 
                    key={app.id} 
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100  relative overflow-hidden"
                  >

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-black text-slate-800">
                            {new Date(app.startDate).toLocaleTimeString('hr-HR', {hour:'2-digit', minute:'2-digit'})}h
                          </span>
                          <span className="bg-indigo-50 text-indigo-700 text-s font-bold px-2 py-1 rounded uppercase tracking-wider">
                            {app.service.name}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-slate-700">
                            <span className="font-bold">Klijent:</span> {app.client.firstName} {app.client.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                        <p className="text-xs text-slate-700 uppercase font-bold tracking-widest mb-1">Kontakt telefon</p>
                        <p className="text-slate-800 font-mono ">
                          {app.client.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg font-medium italic">Trenutno nema zakazanih budućih termina</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}


