import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../api.js";

export default function ClientProfile() {
    const { token, user, logout } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
  const appointmentsQuery = useQuery({
    // ako se nesta od ovoga promjeni, okini funkciju
    queryKey:['appointments'],
    queryFn: async() => {
    
      const response = await api.get("/api/app/getClientAppointments",{
        params: {
            clientId: user.id
        },
        
        headers: {
            Authorization: `Bearer ${token}`
        }

        });
      
      return response.data.appointments;
    },
    onError: (error) => {
      console.error("Appointment fetch failed", error.message);
      toast.error('Neuspješno dohvacanje appointmenta');
    },
    enabled:() => !!user?.id
    
  });

  const handleDelete = async(id) => {

    const potvrda = window.confirm("Jesi li siguran da želiš otkazati ovaj termin?");

    if (!potvrda) return;
   
    try {     
        const response = await api.delete("/api/app/deleteAppointment", 
          {
            params: {
                id: id
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
            toast.success('Uspješno obrisan termin');

            // Osvježi listu termina da obrisani odmah nestane
            queryClient.invalidateQueries(['appointments']);
        } catch (error) {
            console.log("Delete appointment failed", error.message);
            toast.error('Neuspješno obrisan  termin');
        }

  }

  const appointments = appointmentsQuery.data;
 
  const now = new Date();
  const futureApp = appointments?.filter(app => new Date(app.startDate) >= now );
  const pastApp = appointments?.filter(app=> new Date(app.startDate) < now );


    if (isLoading || !user || appointmentsQuery.isLoading) {
        return (
            <div>
                <ClipLoader loading={isLoading} size={50} color={"#3498db"} />
            </div>
        );
    }

return (
  <div className="min-h-screen bg-slate-50 py-10 px-4">
    <div className="max-w-2xl mx-auto space-y-8">
      
      {/* KARTICA PROFILA */}
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

      {/* AKTIVNI TERMINI */}
      <section>
        <h2 className="text-2xl font-black text-slate-800 mb-4 px-2 flex items-center gap-2">
          Rezervirani termini
        </h2>
        
        <div className="space-y-4">
          {futureApp?.length > 0 ? (
            futureApp.map(app => (
              <div key={app.id} className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex justify-between items-center ">
                <div>
                  <p className="font-black text-slate-800 text-lg">{app.service.name}</p>
                  <p className="text-slate-800 text-m">Frizer: {app.hairdresser.firstName} {app.hairdresser.lastName}</p>
                  <p className="text-lg text-indigo-600 font-semibold">
                    {new Date(app.startDate).toLocaleString('hr-HR', { 
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}h
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(app.id)}
                  className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all  tracking-wider"
                >
                  Otkaži
                </button>
              </div>
            ))
          ) : (
            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 italic">
              Trenutno nemaš zakazanih termina.
            </div>
          )}
        </div>
      </section>

      {/* PROŠLI TERMINI */}
      <section>
        <h2 className="text-xl font-black text-slate-800 mb-4 px-2">Povijest posjeta</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-sm">
          {pastApp?.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {pastApp.map(app => (
                <div key={app.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <span className="font-bold text-slate-700">{app.service.name}</span>
                  <span className="text-slate-400 ">
                    {new Date(app.startDate).toLocaleDateString('hr-HR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-slate-400">Nema prošlih termina.</p>
          )}
        </div>
      </section>

    </div>
  </div>
);
}

