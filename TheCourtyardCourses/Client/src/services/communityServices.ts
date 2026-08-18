import api from './api';

export const communityServices = {
  createCommunity: async (data: FormData) => {
    const res = await api.post('/community', data);
    return res.data;
  },

  fetchMyCommunities: async () => {
    const res = await api.get('/community/my');
    return res.data;
  },

  fetchCommunities: async (page = 1, limit = 10) => {
    const res = await api.get('/community', { params: { page, limit } });
    return res.data;
  },

  fetchCommunity: async (slug: string) => {
    const res = await api.get(`/community/${slug}`);
    return res.data;
  },

  updateCommunity: async (slug: string, formData: FormData) => {
    const res = await api.put(`/community/${slug}`, formData);
    return res.data;
  },

  deleteCommunity: async (slug: string) => {
    const res = await api.delete(`/community/${slug}`);
    return res.data;
  },

  joinCommunity: async (slug: string) => {
    const res = await api.post(`/community/${slug}/join`);
    return res.data;
  },

  leaveCommunity: async (slug: string) => {
    const res = await api.post(`/community/${slug}/leave`);
    return res.data;
  },
};
