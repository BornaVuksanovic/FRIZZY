import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"


export default function AdminPanel() {
    const { token, user, logout } = useAuthStore();
    const [hairdressers, setHairdressers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getHairdressers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:1000/api/app/getHairdressers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setHairdressers(response.data.hairdressers);
            console.log("uspjesno dohvaceni frizeri")
            
        } catch (error) {
            console.log("Error getting hairdressers");
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getHairdressers();
    },[])

    if ( isLoading || !hairdressers){
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
            <p>{hairdressers[0].username}</p>
            <p>{hairdressers[1].username}</p>
        </div>
        <div>
            <button onClick={logout}>
                <p>odjava</p>
            </button>
        </div>
    </div>

  )
}

