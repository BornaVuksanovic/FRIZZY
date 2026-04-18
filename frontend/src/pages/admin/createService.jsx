import { useAuthStore } from "../../store.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


export default function CreateService() {
    const[serviceName, setServiceName] = useState("");
    const[price, setPrice] = useState(0);
    const[duration, setDuration] = useState(0);
    const[isLoading, setIsLoading] = useState(true);
    const { token, user } = useAuthStore();
    const navigate = useNavigate();


    const handleCreation = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const formData = {username, password, firstName, lastName, phoneNumber, role};
            const response = await axios.post("http://localhost:1000/api/auth/registerHairdresser", formData); 

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
        <div>
            <h1>Kreiraj račun</h1>
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

                <button type="submit" onClick={handleRegister} >Kreiraj</button>
            </form>
        </div>
    )
}

