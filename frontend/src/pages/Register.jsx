import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[phoneNumber, setPhoneNumber] = useState("");
    const { register, token, user } = useAuthStore();
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();
        const result = await register(username, password, firstName, lastName, phoneNumber);

        if( !result.success ){
           console.log("error handleRegister"); 
        } 
        else{
            navigate("/clientProfile")
            console.log("uspjesan registriran");
        } 
    }

    useEffect(()=>{
        if( user?.role == "CLIENT"){
            navigate("/clientProfile");
        }    
    }, [user]);

    return (
        <div>
            <h1>Registracija</h1>
            <form>
                <div>
                    <p>Korisničko ime</p>
                    <input 
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Unesi korisničko ime"
                    />
                </div>
                <div>
                    <p>Lozinka</p>
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Unesi lozinku"
                    />
                </div>
                <div>
                    <p>Ime</p>
                    <input 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Unesi Ime"
                    />
                </div>
                <div>
                    <p>Prezime</p>
                    <input 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Unesi prezime"
                    />
                </div>
                <div>
                    <p>Broj telefona</p>
                    <input 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Unesi broj telefona"
                    />
                </div>

                <button type="submit" onClick={handleRegister} >Registriraj se</button>
            </form>
        </div>
    )
}

