import axiosInstance from '@/api/api';
import { UserData } from './types';

// ── Usuarios ──────────────────────────────────────────────────────────────────

export const fetchUsers = async (): Promise<UserData[]> => {
  const res = await axiosInstance.get('/users');
  // El backend puede devolver el array directo o dentro de data/items
  const data = res.data?.data ?? res.data?.items ?? res.data;
  return Array.isArray(data) ? data : [];
};

export const addUser = async (user: Omit<UserData, 'id'>): Promise<UserData> => {
  const res = await axiosInstance.post('/users', {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  });
  return res.data?.data ?? res.data;
};

export const updateUser = async (user: UserData): Promise<UserData> => {
  const res = await axiosInstance.put(`/users/${user.id}`, {
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.password ? { password: user.password } : {}),
  });
  return res.data?.data ?? res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
