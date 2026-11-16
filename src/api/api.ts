// src/utils/axiosInstance.ts
import axios from 'axios';

let isRedirectingToLogin = false;

// Single source for the API host; set NEXT_PUBLIC_API_URL outside local development (#53).
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores de solicitud (opcional)
axiosInstance.interceptors.request.use(
  (config) => {
    // Por ejemplo, agregar un token de autenticación en los encabezados
    const token = localStorage.getItem('token'); // o desde donde lo tengas almacenado
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptores de respuesta (opcional)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url ?? '';
    const isLoginRequest = requestUrl.includes('/auth/login');

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isRedirectingToLogin &&
      typeof window !== 'undefined'
    ) {
      isRedirectingToLogin = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
