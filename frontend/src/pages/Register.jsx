import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[phoneNumber, setPhoneNumber] = useState("");
    const[ERROR, setERROR] = useState("");
    const { register, token, user } = useAuthStore();
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        if (e) e.preventDefault(); 
        setERROR("");

        try {
            const result = await register(username, password, firstName, lastName, phoneNumber);

            if (result.success) {
                navigate("/createAppointment");
            } else {
                console.log("Backend javio grešku:", result.error);
                setERROR(result.error);
            }
        } catch (err) {
            console.error("GREŠKA U KOMPONENTI:", err);
            setERROR("Došlo je do neočekivane greške u aplikaciji.");
        }
    };

   
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <h2 className="text-center text-4xl font-extrabold text-indigo-600  mb-2">
                    FRIZZY
                </h2>
                
                <h3 className="text-center text-xl font-semibold text-slate-900">
                    Kreiraj račun
                </h3>

            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-10 shadow-xl rounded-3xl border border-slate-100">
                    <form onSubmit={handleRegister} className="space-y-5">
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


                        {ERROR && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-md">
                                <p className="text-red-700 text-sm font-medium">{ERROR}</p>
                            </div>
                        )}
                        

                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold  hover:bg-indigo-700 "
                            > 
                                Registriraj se
                            </button>
                        </div>
                    </form>                    
                </div>
                
            </div>
        </div>
    )
}

