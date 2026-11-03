import axiosInstance from './api';

export interface InstallationRecord {
  id: number;
  name: string;
  quantity: number;
  file?: string | null;
  details: string;
  property?: {
    id: number;
    address?: string;
    locality?: string;
    province?: string;
  };
}

const unwrapList = (value: unknown): InstallationRecord[] => {
  if (Array.isArray(value)) return value as InstallationRecord[];
  if (value && typeof value === 'object' && 'data' in value) {
    return unwrapList((value as { data: unknown }).data);
  }
  return [];
};

export const getInstallations = async (): Promise<InstallationRecord[]> => {
  const response = await axiosInstance.get('/installation');
  return unwrapList(response.data);
};

export const getInstallation = async (id: number): Promise<InstallationRecord> => {
  const response = await axiosInstance.get(`/installation/${id}`);
  return (response.data?.data ?? response.data) as InstallationRecord;
};

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
