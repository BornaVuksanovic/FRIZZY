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



  const services = servicesQuery.data;
  const hairdressers = hairdressersQuery.data;
  const isLoading = servicesQuery.isLoading || hairdressersQuery.isLoading;



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
              showTimeSelect // omogućuje biranje sati/minuta
              timeIntervals={30}
              timeFormat="HH:mm"
              dateFormat="dd.MM.yyyy HH:mm"
              minTime={new Date(new Date().setHours(9,0,0))}
              maxTime={new Date(new Date().setHours(18,0,0))}
              minDate={new Date()} // ne moze bukirati proslost
              filterDate={(date) => date.getDay() !== 0}
              inline // kalendar uvijek vidljiv
            />
            
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"].map(vrijeme => (
            <button 
              key={vrijeme}
              type="button"
              className={startDate.getHours() === parseInt(vrijeme) ? 'active' : ''}
              onClick={() => {
                const [h, m] = vrijeme.split(":");
                const noviDatum = new Date(startDate);
                noviDatum.setHours(parseInt(h), parseInt(m), 0);
                setStartDate(noviDatum);
              }}
            >
              {vrijeme}
            </button>
          ))}
          </div>

            <button type="submit" onClick={handleCreation} disabled={isPending}>{isPending? "Kreiranje..." : "Rezerviraj"}</button>
          </div>

        )}

      
    </div>
  )
}

