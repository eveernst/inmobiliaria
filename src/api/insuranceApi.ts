// Ejemplo de uso en un servicio o componente
import axiosInstance from '../api/api';

const saveInsurance = async (data: any) => {
  try {
    const response = await axiosInstance.post('/insurance', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getInsurance = async () => {
  try {
    const response = await axiosInstance.get('/insurance');
    return response.data;
  } catch(error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export { saveInsurance, getInsurance };