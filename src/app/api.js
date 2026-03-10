// api.js
import axios from 'axios';
import baseUrl from './baseUrl'; // Ensure this path is correct for your project

const api = axios.create({
  baseURL: baseUrl.AUTH, 
  withCredentials: true, // REQUIRED: This allows the browser to send/receive cookies
});

// ✅ INTERCEPTOR: Automatically attaches the clinicToken if it exists
api.interceptors.request.use(
  (config) => {
    const clinicToken = typeof window !== "undefined" ? localStorage.getItem("clinicToken") : null;

    if (clinicToken && clinicToken !== "undefined") {
      config.headers.Authorization = `Bearer ${clinicToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;