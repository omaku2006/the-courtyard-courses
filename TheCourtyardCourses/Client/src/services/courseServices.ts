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

  updateCourse: async (courseId: string, data: FormData | Record<string, unknown>) => {
    const res = await api.put(`/course/${courseId}`, data);
    return res.data;
  },

  fetchCourse: async ({ slug }: { slug: string }) => {
    const res = await api.get(`/course/${slug}`);
    return res.data;
  },

  fetchCourseRatings: async (courseId: string) => {
    const res = await api.get(`/course/${courseId}/ratings`);
    return res.data;
  },

  updateRating: async (courseId: string, stars: number) => {
    const res = await api.post(`/course/${courseId}/ratings`, { stars });
    return res.data;
  },
};
