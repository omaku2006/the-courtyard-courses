import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { courseServices } from '../../services/courseServices';
import { toast } from 'sonner';

export const useCreateCourse = () => {
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
      queryClient.invalidateQueries({ queryKey: ['course'] });
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

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: FormData | Record<string, unknown>;
      slug?: string;
    }) => courseServices.updateCourse(courseId, data),
    onSuccess: (_data, variables) => {
      toast.success('Curriculum Amended!', {
        description: 'The course details have been updated in the Courtyard archives.',
      });
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      if (variables.slug) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.slug] });
      }
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

export const useFetchCourseRatings = (courseId: string) => {
  return useQuery({
    queryKey: ['courseRatings', courseId],
    queryFn: () => courseServices.fetchCourseRatings(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, stars }: { courseId: string; stars: number }) =>
      courseServices.updateRating(courseId, stars),
    onSuccess: (_data, variables) => {
      toast.success('Verdict Recorded!', {
        description: 'Your review has been etched into the Courtyard records.',
      });
      queryClient.invalidateQueries({ queryKey: ['courseRatings', variables.courseId] });
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

export const useFetchCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseServices.fetchCourses,
  });
};
