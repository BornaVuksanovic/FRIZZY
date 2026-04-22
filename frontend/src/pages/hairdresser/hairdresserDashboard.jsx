import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export default function HairdresserDashboard() {
  const { token, user } = useAuthStore();
  const [today, setToday] = useState(new Date());

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getHairdresserAppointments",{
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
    <div>
      <h1>Današnji termini</h1>
        <h2>{today.toLocaleDateString('hr-HR')}</h2>
        <div>
          { appointments?.length > 0 ? (
             appointments.map(app=> (
             <div key={app.id}>
                <p>{app.service.name} - {new Date(app.startDate).toLocaleTimeString('hr-HR', { hour: '2-digit',minute: '2-digit'})}</p>
                <p>Client: {app.client.firstName} {app.client.lastName} - tel:{app.client.phoneNumber} </p>
             </div>
            ) )
          )
          :
          (<p>Nema rezervacija za danas</p>)
          }
        </div>




    </div>
  )
}


