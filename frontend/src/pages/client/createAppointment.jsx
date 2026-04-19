import { useAuthStore } from "../../store.js";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function CreateAppointment() {
  const { token, user } = useAuthStore();

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


  const services = servicesQuery.data;
  const hairdressers = hairdressersQuery.data;
  const isLoading = servicesQuery.isLoading || hairdressersQuery.isLoading;

  if(isLoading) return <ClipLoader />

  return (
    <div>
      <form>
        <h2>Rezerviraj termin</h2>

        <select>
          <option value="">Odaberi uslugu</option>
          {services?.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.price}€ {s.duration} min)</option>
          ))}
        </select>

        <select>
          <option value="">Odaberi frizera</option>
          {hairdressers?.map(h => (
            <option key={h.id} value={h.id}>{h.firstName} {h.lastName}</option>
          ))}
        </select>
      </form>
    </div>
  )
}

