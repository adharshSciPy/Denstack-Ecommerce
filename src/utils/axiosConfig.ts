import axios from 'axios';
import baseUrl from '../app/baseUrl';
import Cookies from 'js-cookie';

// Create axios instances for different endpoints
export const authAxios = axios.create({
  baseURL: baseUrl.AUTH,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
authAxios.interceptors.request.use(
  (config) => {
    // Check for both token types
    const userToken = Cookies.get('userAccessToken');
    const clinicToken = Cookies.get('clinicAccessToken');
    
    // Determine endpoint and token
    const url = config.url || '';
    
    if (url.includes('/clinicuser/')) {
      // Clinic endpoints should use clinic token
      if (clinicToken) {
        config.headers.Authorization = `Bearer ${clinicToken}`;
      }
    } else {
      // Regular user endpoints should use user token
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token errors
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      Cookies.remove('userAccessToken');
      Cookies.remove('clinicAccessToken');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);