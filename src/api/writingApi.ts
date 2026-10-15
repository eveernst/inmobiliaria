// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';
import { WritingPayload } from '@/lib/types';

const saveWriting = async (data: WritingPayload & { propertyId: number }) => {
  try {
    const response = await axiosInstance.post('/writing', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const updateWriting = async (id: number, data: WritingPayload) => {
  try {
    const response = await axiosInstance.put(`/writing/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
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

// GET /writing/:id answers a GenericResponse: the writing is in `data`.
const getWritingById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/writing/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error al obtener el documento:', error);
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

export { saveWriting, updateWriting, getWriting, getWritingById, deleteWriting };
