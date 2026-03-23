import axiosInstance from '../api/api';

// Subir archivo PDF de plano asociado a una propiedad
const uploadPlanFile = async (propertyId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axiosInstance.post(`/property/${propertyId}/plan`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir archivo de plano:', error);
    throw error;
  }
};

// Guardar los datos del formulario de plano
const savePlan = async (propertyId: number, data: any) => {
  try {
    const response = await axiosInstance.post('/plan', { ...data, propertyId });
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos del plano:', error);
    throw error;
  }
};

const getPlans = async (propertyId: number) => {
  try {
    const response = await axiosInstance.get(`/plan?propertyId=${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener planos:', error);
    throw error;
  }
};

export { savePlan, uploadPlanFile, getPlans };