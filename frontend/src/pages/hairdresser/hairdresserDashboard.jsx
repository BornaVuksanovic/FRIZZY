import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function HairdresserDashboard() {
  const { token, user } = useAuthStore();

  return (
    <div>
      <h1>Nadzorna Ploča</h1>
        <h2>{user.username}</h2>
    </div>
  )
}


