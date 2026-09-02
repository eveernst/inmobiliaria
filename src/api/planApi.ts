// Ejemplo de uso en un servicio o componente
import axiosInstance from '../api/api';

const savePlan = async (data: any) => {
  try {
    const response = await axiosInstance.post('/plans', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getPlan = async () => {
  try {
    const response = await axiosInstance.get('/plans');
    return response.data;
  } catch(error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

const deletePlan = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

export { savePlan, getPlan, deletePlan };