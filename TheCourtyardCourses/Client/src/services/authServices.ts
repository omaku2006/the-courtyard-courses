import api from './api';

export const authServices = {
  login: async (data: { username?: string; email?: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  register: async (data: {
    name: string;
    email: string;
    username: string;
    avatarImage: string;
    headerImage: string;
    password: string;
    role: string;
    occupation: string;
    experience: number;
    subjects: string;
    description: string;
  }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  fetchMyProfile: async () => {
    const res = await api.get('/users/me/profile');
    return res.data;
  },
};
