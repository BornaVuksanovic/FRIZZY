import { Link, NavLink } from "react-router-dom";
import { User, LayoutDashboard, Clock, Briefcase, Plus, Users, Calendar } from 'lucide-react';


const Navbar = ({ user, token }) => {
    if(!token) {
        return (
            <nav className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                <h1 className="text-2xl font-bold text-indigo-600">FRIZZY</h1>
                <div className="flex gap-4">
                    <Link to="/" className="mt-1.5 text-slate-600 hover:text-indigo-600">Početna</Link>
                    <Link to="/login" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Login</Link>
                    <Link to="/register" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Register</Link> 
                </div>
            </nav>
        );
    }

    //funkcija za renderanje linkova s ikonom
    const NavLink = ({ to, children, icon: Icon }) => (
        <Link to={to} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium">
            <Icon size={18} /> {children}
        </Link> 
    );

    return (
        <nav className="flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm">
            <h1 className="text-xl font-bold text-indigo-600">FRIZZY</h1>
            <div className="flex items-center gap-6">
                { user.role === "CLIENT" ? (
                    <>
                        <NavLink to="/createAppointment" icon={Calendar} >Rezervacija</NavLink>
                        <NavLink to="/clientProfile" icon={User} >Profil</NavLink>
                    </>
                )
                :
                user.role === "HAIRDRESSER" ? (
                    <>
                        <NavLink to="/hairdresserSchedule" icon={Clock}>Raspored</NavLink>
                        <NavLink to="/hairdresserDashboard" icon={LayoutDashboard}>Današni termini</NavLink>
                        <NavLink to="/hairdresserProfile" icon={User}>Profil</NavLink>           
                    </>
                )
                :
                user.role === "ADMIN" ? (
                    <>
                        <NavLink to="/adminPanel" icon={LayoutDashboard}>Admin</NavLink>
                        <NavLink to="/createService" icon={Briefcase}>Dodaj uslugu</NavLink>
                        <NavLink to="/createHairdresser" icon={Users}>Dodaj radnika</NavLink>
                        <NavLink to="/futureAppointments" icon={Clock}>Nadolazeći termini</NavLink>
                        <NavLink to="/pastAppointments" icon={Clock}>Prošli termini</NavLink>
                        <NavLink to="/todayAppointments" icon={Clock}>Današnji termini</NavLink>  
                    </>
                     
                )
                : <></>
                
            
                } 
            </div>

        </nav>
    )
}


export default Navbar;
