import api from './api';

export const postServices = {
  createPost: async (communityId: string, data: FormData) => {
    const res = await api.post(`/communities/${communityId}/posts`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  fetchPosts: async (communityId: string) => {
    const res = await api.get(`/communities/${communityId}/posts`);
    return res.data;
  },

  updatePost: async (communityId: string, postId: string, data: FormData) => {
    const res = await api.put(`/communities/${communityId}/posts/${postId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deletePost: async (communityId: string, postId: string) => {
    const res = await api.delete(`/communities/${communityId}/posts/${postId}`);
    return res.data;
  },

  likePost: async (communityId: string, postId: string) => {
    const res = await api.post(`/communities/${communityId}/posts/${postId}/like`);
    return res.data;
  },

  addComment: async (communityId: string, postId: string, content: string) => {
    const res = await api.post(`/communities/${communityId}/posts/${postId}/comment`, { content });
    return res.data;
  },
};
