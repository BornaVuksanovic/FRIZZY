import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: true,

    register: async (username, password, firstName, lastName, phoneNumber) => {
        try {
            const formData = {username, password, firstName, lastName, phoneNumber};
            const response = await axios.post("http://localhost:1000/api/auth/register", formData);

            const data = response.data;


            localStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token});

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message};
        }
    },

    login: async (username, password) => {
        try {
            const formData = {username, password};
            const response = await axios.post("http://localhost:1000/api/auth/login", formData);

            const data = response.data;

            localStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token});

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    logout: async () => {
        localStorage.removeItem('token');

        set({ user: null, token: null});
    }


}));