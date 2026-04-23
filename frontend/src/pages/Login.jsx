import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const { login, token, user } = useAuthStore();
    const navigate = useNavigate();
  
    useEffect(()=>{
        if (!user) return;
        if( user.role == "CLIENT"){
            navigate("/createAppointment");
        }    
        else if(user.role == "HAIRDRESSER"){
            navigate("/hairdresserDashboard");
        }
        else if(user.role == "ADMIN"){
            navigate("/adminPanel");
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if( !result.success ){
           console.log("error handleLogin",result); 
        } 
        else{            
            console.log("uspjesan login");
        } 
    }


    return ( 
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">

                <h2 className="text-center text-4xl font-extrabold text-indigo-600  mb-2">
                    FRIZZY
                </h2>
                
                <h3 className="text-center text-xl font-semibold text-slate-900">
                    Prijavi se u svoj račun
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
                                type="password"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900  placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                onClick={handleLogin} 
                                className="w-full flex justify-center py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold  hover:bg-indigo-700 "
                            > 
                                Prijavi se
                            </button>
                        </div>
                        
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-m text-slate-600">
                            Nemaš račun? 
                        </p>
                        <button 
                            onClick={() => navigate("/register")}
                            className="font-bold text-indigo-600 hover:text-indigo-400  cursor-pointer"
                        >
                            Registriraj se
                        </button>
                    </div>

                </div>

            </div>
                
        </div>
    )
}

