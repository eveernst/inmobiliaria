// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';

const saveWriting = async (data: any) => {
  try {
    const response = await axiosInstance.post('/writing', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getWriting = async () => {
  try {
    const response = await axiosInstance.get('/writing');
    return response.data;
  } catch(error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

const deleteWriting = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/writing/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

export { saveWriting, getWriting, deleteWriting };