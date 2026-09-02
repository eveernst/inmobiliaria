import axiosInstance from './api';

const getClassifications = async () => {
  try {
    const response = await axiosInstance.get('/classification');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las clasificaciones:', error);
    throw error;
  }
};

export { getClassifications };
