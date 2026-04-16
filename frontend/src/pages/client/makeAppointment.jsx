import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function MakeAppointment() {
  const { token } = useAuthStore();

  return (
    <div>
      <h1>Rezervacija termina</h1>
        <h2>odaberi termin</h2>
    </div>
  )
}

