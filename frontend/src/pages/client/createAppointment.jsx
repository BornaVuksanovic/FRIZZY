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

  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];

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
    <div>
        <h2>Rezerviraj termin</h2>
        {step == 1 && (
          <div>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Odaberi uslugu</option>
              {services?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.price}€ {s.duration} min)</option>
              ))}
            </select>

            <select
              value={hairdresser}
              onChange={(e) => setHairdresser(e.target.value)}
            >
              <option value="">Odaberi frizera</option>
              {hairdressers?.map(h => (
                <option key={h.id} value={h.id}>{h.firstName} {h.lastName}</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => setStep(2)} 
              disabled={!service || !hairdresser}
            >
              Dalje
            </button>
          </div>
        )}
        
        {step == 2 && (
          <div>
            <button type="button" onClick={() => setStep(1)}>Natrag</button>
            <label>Odaberi slobodan termin:</label>
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
            
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {slots.map(slot => {
            const busy = isSlotBusy(slot);
            return (
              <button 
                key={slot}
                type="button"
                disabled={busy} // ako je zauzet, ne moze se kliknut
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

            <button type="submit" onClick={handleCreation} disabled={isPending}>{isPending? "Kreiranje..." : "Rezerviraj"}</button>
          </div>

        )}

      
    </div>
  )
}

