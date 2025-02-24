// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';

const saveRented = async (data: any) => {
  try {
    const response = await axiosInstance.post('/rented', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getRented = async () => {
  try {
    const response = await axiosInstance.get('/rented');
    return response.data;
  } catch(error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export { saveRented, getRented };