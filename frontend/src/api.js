import axios from 'axios';


const BASE_URL = import.meta.env.DEV 
  ? "http://localhost:1000" 
  : "https://frizzy.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;