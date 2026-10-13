// Ejemplo de uso en un servicio o componente
import axiosInstance from './api';
import { PropertyUpdatePayload } from '@/lib/types';

export interface PropertyFilters {
  province?: string;
  classification?: string;
  state?: string;
  address?: string;
}

const saveProperty = async (data: any) => {
  try {
    const response = await axiosInstance.post('/property', data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    throw error;
  }
};

const getProperties = async (filters: PropertyFilters = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value?.trim()),
    );
    const response = await axiosInstance.get('/property', { params });
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

const editProperty = async (id: number, payload: PropertyUpdatePayload) => {
  try {
    const response = await axiosInstance.put(`/property/${id}`, payload);
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