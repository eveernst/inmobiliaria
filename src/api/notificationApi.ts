import axiosInstance from './api';

// Shape of GET /notification (ReadNotificationDto): the logged-in user's own notices.
export interface NoticeRecord {
  id: number;
  message: string;
  type: string;
  date: string;
}

const getNotifications = async (): Promise<NoticeRecord[]> => {
  try {
    const response = await axiosInstance.get('/notification');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al obtener los avisos:', error);
    throw error;
  }
};

export { getNotifications };
