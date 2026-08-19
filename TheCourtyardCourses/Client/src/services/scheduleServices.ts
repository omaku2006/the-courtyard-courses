import api from './api';

export const scheduleServices = {
  fetchSchedule: async () => {
    const res = await api.get('/users/me/schedule');
    return res.data;
  },

  createSchedule: async (data: { courseId: string; days: number[]; targetChaptersPerDay: number }) => {
    const res = await api.post('/users/me/schedule', data);
    return res.data;
  },

  deleteSchedule: async (scheduleId: string) => {
    const res = await api.delete(`/users/me/schedule/${scheduleId}`);
    return res.data;
  },

  fetchDailyActivity: async (month: number, year: number) => {
    const res = await api.get('/users/me/daily-activity', { params: { month, year } });
    return res.data;
  },
};
