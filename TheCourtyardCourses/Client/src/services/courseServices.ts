import api from './api';

export const courseServices = {
  createCourse: async (data: FormData) => {
    const res = await api.post('/course/', data);
    return res.data;
  },

  fetchMyCourses: async () => {
    const res = await api.get('/course/me/courses');
    return res.data;
  },

  publishCourse: async (courseId: string, publishedAt?: string | null) => {
    const res = await api.patch(`/course/${courseId}/publish`, {
      ...(publishedAt === undefined ? {} : { publishedAt }),
    });
    return res.data;
  },
};
