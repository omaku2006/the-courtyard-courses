import api from './api';

export const courseServices = {
  createCourse: async (data: FormData) => {
    const res = await api.post('/course/', data);
    return res.data;
  },

  fetchMyCourses: async (page = 1, limit = 9) => {
    const res = await api.get('/course/me/courses', { params: { page, limit } });
    return res.data;
  },

  fetchEnrolledCourses: async (page = 1, limit = 9) => {
    const res = await api.get('/course/me/enrolled', { params: { page, limit } });
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

  fetchCourses: async (page = 1, limit = 9) => {
    const res = await api.get('/course/', { params: { page, limit } });
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

  updateRating: async (courseId: string, stars: number, description?: string) => {
    const res = await api.post(`/course/${courseId}/ratings`, { stars, description });
    return res.data;
  },

  enrollCourse: async (courseId: string) => {
    const res = await api.post(`/course/${courseId}/enroll`);
    return res.data;
  },

  verifyPayment: async (payload: {
    courseId: string;
    orderId: string;
    paymentId: string;
    signature: string;
  }) => {
    const res = await api.post('/course/payment/verify', payload);
    return res.data;
  },

  fetchWishlistStatus: async (courseId: string) => {
    const res = await api.get(`/course/${courseId}/wishlist`);
    return res.data;
  },

  toggleWishlist: async (courseId: string) => {
    const res = await api.post(`/course/${courseId}/wishlist`);
    return res.data;
  },

  fetchCourseProgress: async (courseId: string) => {
    const res = await api.get(`/course/${courseId}/progress`);
    return res.data;
  },

  toggleChapterProgress: async (courseId: string, chapterIndex: number) => {
    const res = await api.post(`/course/${courseId}/progress`, { chapterIndex });
    return res.data;
  },

  deleteCourse: async (courseId: string) => {
    const res = await api.delete(`/course/${courseId}`);
    return res.data;
  },
};
