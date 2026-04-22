import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export default function FutureAppointments() {
  const { token, user } = useAuthStore();
  const [today, setToday] = useState(new Date());

  const appointmentsQuery = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/api/app/getAppointments",{
          params: {
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
    <div>
      <h1>Budući termini</h1>
        <div>
          {appointments?.length > 0 ? (
            Object.entries(groupedAppointments).map(([date, apps]) =>(
              <div key={date}>
                <h3>{date}</h3>
                {apps.map(app => (
                  <div key={app.id}>
                    <p>
                      <strong>
                        {app.service.name} {new Date(app.startDate).toLocaleTimeString('hr-HR', {hour:'2-digit', minute:'2-digit'})}
                      </strong>
                    </p>
                    <p>
                        Frizer: {app.hairdresser.firstName} {app.hairdresser.lastName}
                    </p>
                    <p>
                      Klijent: {app.client.firstName} {app.client.lastName} - tel: {app.client.phoneNumber}
                    </p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>Nema budućih termina</p>
          )}
        </div>
    </div>
  )
}


