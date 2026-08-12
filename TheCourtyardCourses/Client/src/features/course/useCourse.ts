import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseServices } from '../../services/courseServices';
import { toast } from 'sonner';

export const createCourse = () => {
  return useMutation({
    mutationFn: courseServices.createCourse,
    onSuccess: () => {
      toast.success('Curriculum Established!', {
        description: 'The course has been successfully added to the Courtyard archives.',
      });
    },
    onError: (error: any) => {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        'A complication has arisen. Pray, try again.';
      toast.error('Interruption in Proceedings', {
        description: backendMessage,
      });
    },
  });
};

export const useMyCourses = () => {
  return useQuery({
    queryKey: ['myCourses'],
    queryFn: courseServices.fetchMyCourses,
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, publishedAt }: { courseId: string; publishedAt?: string | null }) =>
      courseServices.publishCourse(courseId, publishedAt),
    onSuccess: () => {
      toast.success('Publication Status Updated!');
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
    },
    onError: (error: any) => {
      toast.error('Interruption in Proceedings', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    },
  });
};

export const useFetchCourse = (slug: string) => {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseServices.fetchCourse({ slug }),
  });
};
