import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminPanel() {
    const { token, user, logout } = useAuthStore();


  const hairdressersQuery = useQuery({
    queryKey: ['hairdressers'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getHairdressers",{   
          headers: {
            Authorization: `Bearer ${token}`
          }
      });
      return response.data.hairdressers;
    },
    
    onError: (error) => {
      console.error("Get hairdressers failed", error.message);
      toast.error('Neuspješno dohvacanje frizera');
    },
    
    enabled: () => {
     !!user  // Pokreni tek kad imamo admina
    }
    
  });

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getServices",{   
          headers: {
            Authorization: `Bearer ${token}`
          }
      });
      return response.data.services;
    },
    
    onError: (error) => {
      console.error("Get services failed", error.message);
      toast.error('Neuspješno dohvacanje uslugas');
    },
    
    enabled: () => {
     !!user  // Pokreni tek kad imamo admina
    }
    
  });

  const services = servicesQuery.data;
  const hairdressers = hairdressersQuery.data;

  const isLoading = servicesQuery.isLoading || hairdressersQuery.isLoading || !user;

    if (isLoading) {
      return (
          <div>
              <ClipLoader loading={isLoading} size={50} color={"#3498db"} />
          </div>
      );
    }


  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600  ">Kontrolna Ploča</h1>
            </div>
            <button 
              onClick={logout}
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors active:scale-95"
            >
              Odjava
            </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Zaposlenici</h3>
                </div>
                
                <div className="space-y-3">
                  {hairdressers?.map(h => (
                    <div key={h.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold mr-4">
                        {h.firstName[0]}{h.lastName[0]}
                      </div>
                      <p className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {h.firstName} {h.lastName}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Usluge</h3>
                </div>

                <div className="space-y-3">
                  {services?.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent">
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.duration} min</p>
                      </div>
                      <div className="text-lg font-black text-emerald-600">
                        {s.price}€
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
        </div>

    </div>

  )
}

