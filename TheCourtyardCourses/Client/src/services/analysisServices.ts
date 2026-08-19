import api from './api';

export const analysisServices = {
  fetchStudentAnalytics: async () => {
    const res = await api.get('/users/me/analytics');
    return res.data;
  },

  fetchTeacherAnalytics: async () => {
    const res = await api.get('/users/me/teacher-analytics');
    return res.data;
  },
};
