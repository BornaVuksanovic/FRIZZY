import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


function Home() {
  const { token, logout } = useAuthStore();

  return (
    <div>

        <button onClick={logout}>
            <p>odjava</p>
        </button>
    </div>
  )
}

export default Home
