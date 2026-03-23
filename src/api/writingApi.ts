import axiosInstance from './api';

// Subir archivo PDF de escritura asociado a una propiedad
const uploadWritingFile = async (propertyId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axiosInstance.post(`/property/${propertyId}/writing`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir archivo de escritura:', error);
    throw error;
  }
};

// Guardar los datos del formulario de escritura
const saveWriting = async (propertyId: number, data: any) => {
  try {
    const response = await axiosInstance.post('/writing', { ...data, propertyId });
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos de escritura:', error);
    throw error;
  }
};

const getWritings = async (propertyId: number) => {
  try {
    const response = await axiosInstance.get(`/writing?propertyId=${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener escrituras:', error);
    throw error;
  }
};

export { saveWriting, uploadWritingFile, getWritings };