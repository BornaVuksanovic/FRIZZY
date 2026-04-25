import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function CreateHairdresser() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[phoneNumber, setPhoneNumber] = useState("");
    const[role, setRole] = useState("HAIRDRESSER");
    const[isLoading, setIsLoading] = useState(true);
    const { token, user } = useAuthStore();
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const formData = {username, password, firstName, lastName, phoneNumber, role};
            const response = await api.post("/api/app/registerHairdresser",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                }}
            ); 

            console.log("Hairdresser created", response.data.user.username);

            toast.success('Uspješno kreiran korisnik');
            navigate("/adminPanel");

        } catch (error) {
            console.log("Hairdresser creation failed", error.message);
            toast.error('Neuspješno kreiran korisnik');
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <h3 className="text-center text-3xl font-semibold text-slate-900">
                    Kreiraj račun frizeru
                </h3>

            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-10 shadow-xl rounded-3xl border border-slate-100">
                    <form className="space-y-5">
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">
                                Korisničko ime
                            </label>
                            <input 
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Unesi korisničko ime"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">
                                Lozinka
                            </label>
                            <input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Unesi lozinku"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">
                                Ime
                            </label>
                            <input 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Unesi Ime"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">
                                Prezime
                            </label>
                            <input 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Unesi prezime"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>
                        <div>
                            <label className="block text-m font-semibold text-slate-700 mb-2">
                                Broj telefona
                            </label>
                            <input 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Unesi broj telefona"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                onClick={handleRegister} 
                                className="w-full flex justify-center py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold  hover:bg-indigo-700 "
                            > 
                                Kreiraj novog radnika
                            </button>
                        </div>
                    </form>                    
                </div>
                
            </div>
        </div>
    )
}

