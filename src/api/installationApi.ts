import axiosInstance from "./api";

export interface InstallationProperty {
  id: number;
  address: string;
  locality: string;
  province: string;
}

export interface InstallationClassification {
  id: number;
  name: string;
}

export interface Installation {
  id: number;
  name: string;
  quantity: number;
  file?: string;
  details: string;
  classification?: InstallationClassification;
  property?: InstallationProperty;
}

export const getInstallations = async (): Promise<Installation[]> => {
  const response = await axiosInstance.get("/installation");
  return Array.isArray(response.data) ? response.data : [];
};

export const getInstallation = async (id: number): Promise<Installation> => {
  const response = await axiosInstance.get(`/installation/${id}`);
  return response.data?.data ?? response.data;
};

const deleteInstallation = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/installation/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la instalación:", error);
    throw error;
  }
};

export { deleteInstallation };
