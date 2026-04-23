import { useAuthStore } from "../../store.js";
import { useNavigate, Link, data } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import toast from "react-hot-toast";


export default function CreateAppointment() {
  const { token, user } = useAuthStore();
  const [service, setService] = useState("");
  const [hairdresser, setHairdresser] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [step, setStep] = useState(1); 
  const navigae = useNavigate();
  const queryClient = useQueryClient();

  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00","15:30", "16:00"];

  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getServices", {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.services;
    }
  });

  const hairdressersQuery = useQuery({
    queryKey: ['hairdressers'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getHairdressers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.hairdressers;
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
        const response = await axios.post("http://localhost:1000/api/app/createAppointment", 
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        return response.data.appointment;
    },
    onSuccess: () => {
      console.log("Appointment created");
      toast.success('Uspješno kreiran termin');

      //osvjezava listu termina na profilu
      queryClient.invalidateQueries({ queryKey: ['appointments']});
      navigae("/clientProfile");
    },
    onError: (error) => {
      console.error("Appointment creation failed", error.message);
      toast.error('Neuspješno kreiran termin');
    }
  });

  const handleCreation = (e) => {
    e.preventDefault();

    const formData = {
      startDate: new Date(startDate),
      clientId: user.id,
      hairdresserId: parseInt(hairdresser),
      serviceId: parseInt(service)
    };
    console.log(formData);
    mutate(formData); // pokrecem mutaciju i saljem formData u mutationFn
  }

  const isSlotBusy = (slotTime) => { //slot time npr. 10:30

    const [hours, minutes] = slotTime.split(":").map(Number); // button vrijednost pretvaramu Date
    const slotDate = new Date(startDate);
    slotDate.setHours(hours,minutes,0,0);

    const currentSlotTime = slotDate.getTime();
    const now = new Date();
    if(now.getTime() > currentSlotTime) return true;

    if( !appointments ) return false;

    return (appointments || []).some(app => {
      const start = new Date(app.startDate).getTime();
      const end = start + (app.service.duration * 60000);

      return currentSlotTime >= start && currentSlotTime < end;
    })
  }

  const appointmentsQuery = useQuery({
    // ako se nesta od ovoga promjeni, okini funkciju
    queryKey:['appointments', hairdresser, startDate.toDateString()],
    queryFn: async() => {
      if( hairdresser == "") return [];

      const response = await axios.get("http://localhost:1000/api/app/getHairdresserAppointments", {
          params: {
            hairdresserId: parseInt(hairdresser),
            date: startDate.toISOString(),
            type: 'today'
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
    
    enabled: () => {
     !!hairdresser && step === 2 // Pokreni tek kad imamo frizera i kad smo na Step 2
    }
    
  });

  const services = servicesQuery.data;
  const hairdressers = hairdressersQuery.data;
  const appointments =appointmentsQuery.data;
  const isLoading = servicesQuery.isLoading || hairdressersQuery.isLoading || appointmentsQuery.isLoading;



  if(isLoading) return <ClipLoader />

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-5 text-white text-center">
          <h2 className="text-3xl font-bold">Rezerviraj termin</h2>
          <p className="text-indigo-100 mt-2 text-xl">
            {step === 1 ? "Odaberi uslugu i frizera" : "Odaberi datum i vrijeme"}
          </p>
        </div>
        <div className="p-8">
          {step == 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-m font-semibold text-slate-700 mb-2">Usluga</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  cursor-pointer"
                >
                  <option value="">Odaberi uslugu</option>
                  {services?.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.price}€ {s.duration} min)</option>
                  ))}
                </select>

              </div>
              <div>
                <label className="block text-m font-semibold text-slate-700 mb-2">Frizer</label>
                <select
                  value={hairdresser}
                  onChange={(e) => setHairdresser(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  cursor-pointer"
                >
                  <option value="">Odaberi frizera</option>
                  {hairdressers?.map(h => (
                    <option key={h.id} value={h.id}>{h.firstName} {h.lastName}</option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                onClick={() => setStep(2)} 
                disabled={!service || !hairdresser}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold  hover:bg-indigo-900 disabled:bg-slate-200 disabled:text-slate-400"
              >
                Dalje
              </button>
            </div>
          )}

          {step == 2 && (
            <div className="space-y-5 text-center">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4 flex items-center justify-center gap-1 mx-auto"
              >
                Natrag
              </button>

              <div className="flex justify-center rounded-2xl overflow-hidden border border-slate-100 p-2 bg-slate-50">
                <DatePicker 
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  // omogućuje biranje sati/minuta
                  timeFormat="HH:mm"
                  dateFormat="dd.MM.yyyy HH:mm"
                  minTime={new Date(new Date().setHours(9,0,0))}
                  maxTime={new Date(new Date().setHours(18,0,0))}
                  minDate={new Date()} // ne moze bukirati proslost
                  filterDate={(date) => date.getDay() !== 0}
                  inline // kalendar uvijek vidljiv
                />
              </div>
              
              
              <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Dostupni termini</h3>
                  <div className="grid grid-cols-3 gap-3">
                  {slots.map(slot => {
                  const busy = isSlotBusy(slot);
                  return (
                    <button 
                      key={slot}
                      type="button"
                      disabled={busy} // ako je zauzet, ne moze se kliknut
                      className={`
                        py-3 px-4 rounded-2xl text-sm transition-all duration-200
                        ${busy 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent" 
                          : "bg-indigo-100 text-indigo-700 border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-400 hover:text-white shadow-sm active:scale-95"
                        }
                      `}
                      onClick={() => {
                        const [h, m] = slot.split(":").map(Number);
                        const noviDatum = new Date(startDate);
                        noviDatum.setHours(h,m,0,0);
                        setStartDate(noviDatum);
                      }}
                    >
                      {slot}
                    </button>
                    )
                  }
                )}
              </div>
            
              </div>


              <button 
                type="submit" 
                onClick={handleCreation} 
                disabled={isPending}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 disabled:bg-slate-200 transition-all"
              >
                {isPending? "Kreiranje..." : "Rezerviraj"}
              </button>
          </div>

          )}
          
        </div>
          
        

      </div>
        

      
    </div>
  )
}

