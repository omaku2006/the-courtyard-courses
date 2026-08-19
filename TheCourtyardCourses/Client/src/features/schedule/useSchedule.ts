import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleServices } from '../../services/scheduleServices';
import { toast } from 'sonner';

export const useFetchSchedule = () => {
  return useQuery({
    queryKey: ['schedule'],
    queryFn: () => scheduleServices.fetchSchedule(),
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { courseId: string; days: number[]; targetChaptersPerDay: number }) =>
      scheduleServices.createSchedule(data),
    onSuccess: () => {
      toast.success('Schedule Updated!', {
        description: 'Your study schedule has been set.',
      });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['dailyActivity'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Update Schedule', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => scheduleServices.deleteSchedule(scheduleId),
    onSuccess: () => {
      toast.success('Schedule Removed.', {
        description: 'The course has been removed from your schedule.',
      });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['dailyActivity'] });
    },
    onError: (error: any) => {
      toast.error('Could Not Remove', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen.',
      });
    },
  });
};

export const useFetchDailyActivity = (month: number, year: number) => {
  return useQuery({
    queryKey: ['dailyActivity', month, year],
    queryFn: () => scheduleServices.fetchDailyActivity(month, year),
    enabled: !!month && !!year,
  });
};
