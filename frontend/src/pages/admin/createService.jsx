import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../api.js";


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
            const response = await api.post("/api/app/createService", 
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
        <div className="min-h-screen bg-slate-50 py-12 px-4">

            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 p-5 text-white text-center">
                  <h2 className="text-2xl font-bold">Kreiraj uslugu</h2>  
                </div>
                
                <div className="p-8">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">Naziv</label>
                            <input 
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Unesi naziv usluge"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  cursor-pointer"

                            />
                        </div>
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">Cijena (€)</label>
                            <input 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Unesi cijenu"
                                type="float"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  cursor-pointer"

                            />
                        </div>
                        <div>
                        <label className="block text-m font-semibold text-slate-700 mb-2">Vremensko trajanje (minute)</label>
                        <select 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}
                             className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  cursor-pointer"
                        >
                            <option value="">Odaberi vrijeme</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>             
                        </select>
                        </div>

                        <button 
                            type="submit" 
                            onClick={handleCreation} 
                            disabled={!name || !price || !duration}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold  hover:bg-indigo-900 disabled:bg-slate-200 disabled:text-slate-400"
                        >
                            Kreiraj uslugu
                        </button>
                    </form>
                </div>
               
            </div>
        </ div>
    )
}

