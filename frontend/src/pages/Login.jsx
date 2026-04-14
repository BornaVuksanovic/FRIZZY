import { useAuthStore } from "../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const { login, token } = useAuthStore();
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if( !result.success ){
           console.log("error handleLogin"); 
        } 
        else{
            navigate("/clientProfile")
            console.log("uspjesan login");
        } 
    }

    useEffect(() => {
        if (token) {
            navigate("/clientProfile");
        }
    },[token, navigate]);

    return (
        <div>
            <h1>Prijava</h1>
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
                <button type="submit" onClick={handleLogin} >Prijavi se</button>
            </form>
        </div>
    )
}

