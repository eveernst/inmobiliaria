import axiosInstance from '../api/api';

// Subir archivo PDF de seguro asociado a una propiedad
const uploadInsuranceFile = async (propertyId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axiosInstance.post(`/property/${propertyId}/insurance`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir archivo de seguro:', error);
    throw error;
  }
};

// Guardar los datos del formulario de seguro
const saveInsurance = async (propertyId: number, data: any) => {
  try {
    const response = await axiosInstance.post('/insurance', { ...data, propertyId });
    return response.data;
  } catch (error) {
    console.error('Error al guardar los datos del seguro:', error);
    throw error;
  }
};

const getInsurances = async (propertyId: number) => {
  try {
    const response = await axiosInstance.get(`/insurance?propertyId=${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener seguros:', error);
    throw error;
  }
};

export { saveInsurance, uploadInsuranceFile, getInsurances };