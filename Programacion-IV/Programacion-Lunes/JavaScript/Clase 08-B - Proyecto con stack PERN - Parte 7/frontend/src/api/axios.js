import axios from "axios";

// Desarrollo: backend en localhost:3000
// Producción: mismo dominio ("/api"), o VITE_API_URL si el backend está aparte
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;