import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: true,

    register: async (username, password, firstName, lastName, phoneNumber) => {
        set({ isLoading: true });
        try {
            const formData = {username, password, firstName, lastName, phoneNumber};
            const response = await axios.post("http://localhost:1000/api/auth/register", formData);

            const data = response.data;

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token});

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message};
        }finally{
            set({ isLoading: false });
        }
    },

    login: async (username, password) => {
        set({ isLoading: true });
        try {
            const formData = {username, password};
            const response = await axios.post("http://localhost:1000/api/auth/login", formData);

            const data = response.data;

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token});

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }finally{
            set({ isLoading: false });
        }
    },

    checkStore: async () => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem('token');

            if (!token) return set({ user: null, isLoading: false }); 

            const response = await axios.get("http://localhost:1000/api/app/testToken", {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ user: response.data.user, token: token });

            return { success: true };
        
        } catch (error) {
            console.log("Check store failed", error);   
        }finally{
            set({ isLoading: false });
        }
    },

    logout: async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        set({ user: null, token: null});
    }


}));