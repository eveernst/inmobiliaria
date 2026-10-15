// Ejemplo de uso en un servicio o componente
import axiosInstance from '../api/api';
import { PlanPayload } from '@/lib/types';

const savePlan = async (data: PlanPayload & { propertyId: number }) => {
  try {
    const response = await axiosInstance.post('/plans', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const updatePlan = async (id: number, data: PlanPayload) => {
  try {
    const response = await axiosInstance.put(`/plans/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
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

// GET /plans/:id answers a GenericResponse: the plan is in `data`.
const getPlanById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/plans/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error('Error al obtener el documento:', error);
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

export { savePlan, updatePlan, getPlan, getPlanById, deletePlan };
