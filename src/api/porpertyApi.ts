// Ejemplo de uso en un servicio o componente
import axiosInstance from '../api/api';

const saveProperty = async (data: any) => {
  try {
    const response = await axiosInstance.post('/property', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getProperties = async () => {
  try {
    const response = await axiosInstance.get('/property');
    return response.data;
  } catch(error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export { saveProperty, getProperties };