import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function CreateService() {
    const[name, setName] = useState("");
    const[price, setPrice] = useState(0);
    const[duration, setDuration] = useState(0);
    const[isLoading, setIsLoading] = useState(true);
    const { token, user } = useAuthStore();
    const navigate = useNavigate();


    const handleCreation = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const priceFloat = parseFloat(price);
            const durationInt = parseInt(duration);
            const formData = {name: name, price:priceFloat, duration: durationInt};
            const response = await axios.post("http://localhost:1000/api/app/createService", 
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            ); 

            console.log("Service created", response.data.service.name);

            toast.success('Uspješno kreirana usluga');
            navigate("/adminPanel");

        } catch (error) {
            console.log("Service creation failed", error.message);
            toast.error('Neuspješno kreirana usluga');
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>Kreiraj uslugu</h1>
            <form>
                <div>
                    <p>Naziv</p>
                    <input 
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Unesi naziv usluge"
                    />
                </div>
                <div>
                    <p>Cijena</p>
                    <input 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Unesi cijenu"
                        type="float"
                    />
                </div>
                <div>
                <label>Vremensko trajanje</label>
                <select 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                    <option value="60">60</option>
                    <option value="70">70</option> 
                    <option value="80">80</option> 
                    <option value="90">90</option>             
                </select>
                </div>

                <button type="submit" onClick={handleCreation} >Kreiraj uslugu</button>
            </form>
        </div>
    )
}

