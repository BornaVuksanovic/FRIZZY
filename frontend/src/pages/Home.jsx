import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


function Home() {
  
  const navigate = useNavigate();


  return (

   
   
    <body>
    
      <div>
        <h1 className="bg-red-500 text-white p-10 text-center text-4xl">Test Tailwinda</h1>
        <h1>FRIZZY</h1>
          <h2>Rezervacija termina za modernu frizuru u par klikova</h2>
          <button onClick={() => navigate("/login")}>Rezerviraj termin</button>
      </div>
   
    </body>


  )
}

export default Home
