import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function ClientProfile() {
    const { token, user, logout } = useAuthStore();

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
  const appointmentsQuery = useQuery({
    // ako se nesta od ovoga promjeni, okini funkciju
    queryKey:['appointments'],
    queryFn: async() => {
    
      const response = await axios.get("http://localhost:1000/api/app/getClientAppointments",{
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
    enabled:() => {!!user?.id} 
    
  });

  const appointments = appointmentsQuery.data;
 
  const isLoading = !user || appointmentsQuery.isLoading;

    if (isLoading) {
        return (
            <div>
                <ClipLoader loading={isLoading} size={50} color={"#3498db"} />
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>Profil {user.username}</h1>
                <p>Ime: {user.firstName}</p>
                <p>Prezime: {user.lastName}</p>
                <p>Broj telefona: {user.phoneNumber}</p>
            </div>
            <div>
                <h2>Rezervirani termini</h2>
                {appointments?.map( app => <p key={app.id}>{app.service.name} ({app.service.price}€ {app.service.duration}min) {app.startDate}</p>)}
            </div>
            <div>
                <button onClick={logout}>
                    <p>odjava</p>
                </button>
            </div>
            
        </div>

    )
}

