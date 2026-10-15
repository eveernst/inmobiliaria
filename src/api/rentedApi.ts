// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';
import { RentedPayload } from '@/lib/types';

const saveRented = async (data: RentedPayload & { propertyId: number }) => {
  try {
    const response = await axiosInstance.post('/rented', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const updateRented = async (id: number, data: RentedPayload) => {
  try {
    const response = await axiosInstance.put(`/rented/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
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

// GET /rented/:id answers a GenericResponse: the rented record is in `data`.
const getRentedById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/rented/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error al obtener el documento:', error);
    throw error;
  }
};

const deleteRented = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/rented/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

export { saveRented, updateRented, getRented, getRentedById, deleteRented };
