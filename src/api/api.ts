// src/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
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
    // Manejo de errores generales de la API
    if (error.response && error.response.status === 401) {
      // Por ejemplo, redirigir al login si el usuario no está autorizado
      console.log('No autorizado, redirigiendo al login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
