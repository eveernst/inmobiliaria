import axiosInstance from './api';

const deleteInstallation = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/installation/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la instalación:', error);
    throw error;
  }
};

export { deleteInstallation };
