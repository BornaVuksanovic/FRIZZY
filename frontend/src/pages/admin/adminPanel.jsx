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
    <div>
        <div>
        <h1>ADMIN</h1>
            <h2>Panel</h2>
            <h3>Zaposlenici:</h3>
            <div>
                {hairdressers?.map(h => <p key={h.id}>{h.firstName} {h.lastName}</p>)} 
            </div>
            <h3>Usluge:</h3>
            <div>
                {services?.map(s => <p key={s.id}>{s.name} - {s.duration}min {s.price}€</p>)}
            </div>
        </div>
        <div>
            <button onClick={logout}>
                <p>odjava</p>
            </button>
        </div>
    </div>

  )
}

