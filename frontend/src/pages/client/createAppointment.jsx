import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function CreateAppointment() {
  const [userId, setUserId] = useState();
  const [hairdresserId, setHairdresserId] = useState();
  const [serviceId, setServiceId] = useState();
  const [dateTime, setDateTime] = useEffect();
  const { token, user } = useAuthStore();

  const handleCreation = async () => {
    try {
      
    } catch (error) {
      
    }
  }

  return (
    <div>
      <h1>Rezervacija termina</h1>
        <h2>Odaberi Uslugu</h2>

    </div>
  )
}

