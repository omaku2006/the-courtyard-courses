import api from './api';

export const authServices = {
  login: async (data: { username?: string; email?: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  register: async (data: FormData) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  fetchMyProfile: async () => {
    const res = await api.get('/users/me/profile');
    return res.data;
  },

  updateProfile: async (username: string, data: FormData) => {
    const res = await api.put(`/users/${username}`, data);
    return res.data;
  },

  fetchProfile: async (username: string) => {
    const res = await api.get(`/users/${username}`);
    return res.data;
  },

  fetchMyWishlist: async (page = 1, limit = 9) => {
    const res = await api.get('/users/me/wishlist', { params: { page, limit } });
    return res.data;
  },
};
