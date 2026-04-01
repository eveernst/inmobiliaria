// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';

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

const getProperty = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/property/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

const editProperty = async (data: any) => {
  try {
    const response = await axiosInstance.put(`/property/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al editar los datos:', error);
    throw error;
  }
}

const deleteProperty = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/property/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error);
    throw error;
  }
}

export { saveProperty, getProperties, editProperty, getProperty, deleteProperty };