// Ejemplo de uso en un servicio o componente
import axiosInstance from '../api/api';
import { InsurancePayload } from '@/lib/types';

const saveInsurance = async (data: InsurancePayload & { propertyId: number }) => {
  try {
    const response = await axiosInstance.post('/insurance', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const updateInsurance = async (id: number, data: InsurancePayload) => {
  try {
    const response = await axiosInstance.put(`/insurance/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
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

// GET /insurance/:id answers a GenericResponse: the insurance is in `data`.
const getInsuranceById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/insurance/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error al obtener el documento:', error);
    throw error;
  }
};

const deleteInsurance = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/insurance/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    throw error;
  }
};

export { saveInsurance, updateInsurance, getInsurance, getInsuranceById, deleteInsurance };
