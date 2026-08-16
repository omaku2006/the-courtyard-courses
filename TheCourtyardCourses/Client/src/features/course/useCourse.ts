import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useMyCourses = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['myCourses'],
    queryFn: ({ pageParam = 1 }) => courseServices.fetchMyCourses(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    enabled,
  });
};

export const useFetchEnrolledCourses = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['enrolledCourses'],
    queryFn: ({ pageParam = 1 }) => courseServices.fetchEnrolledCourses(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    enabled,
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
    mutationFn: ({
      courseId,
      stars,
      description,
    }: {
      courseId: string;
      stars: number;
      description?: string;
    }) => courseServices.updateRating(courseId, stars, description),
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
  return useInfiniteQuery({
    queryKey: ['courses'],
    queryFn: ({ pageParam = 1 }) => courseServices.fetchCourses(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
  });
};

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if ((window as any).Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  const createOrder = useMutation({
    mutationFn: (courseId: string) => courseServices.enrollCourse(courseId),
  });
  const verify = useMutation({
    mutationFn: (payload: {
      courseId: string;
      orderId: string;
      paymentId: string;
      signature: string;
    }) => courseServices.verifyPayment(payload),
    onSuccess: () => {
      toast.success('Welcome to the Course!', {
        description: 'Your enrollment has been inscribed in the Courtyard records.',
      });
      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      toast.error('Enrollment Interrupted', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    },
  });

  const enroll = async (course: { _id: string; title: string }) => {
    try {
      const data = await createOrder.mutateAsync(course._id);

      // Free course -> server turant enroll kari de che
      if (data.enrolled) {
        toast.success('Welcome to the Course!', {
          description: 'Your enrollment has been inscribed in the Courtyard records.',
        });
        queryClient.invalidateQueries({ queryKey: ['course'] });
        queryClient.invalidateQueries({ queryKey: ['myCourses'] });
        queryClient.invalidateQueries({ queryKey: ['me'] });
        return;
      }

      // Paid course -> Razorpay Checkout kholo
      await loadRazorpayScript();

      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'The Courtyard Courses',
        description: course.title,
        handler: (response: RazorpayResponse) => {
          verify.mutate({
            courseId: course._id,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment Secluded', {
              description: 'No amount was charged. The course remains unclaimed.',
            });
          },
        },
        theme: { color: '#c9a86a' },
      });

      rzp.open();
    } catch (error: any) {
      toast.error('Enrollment Interrupted', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    }
  };

  return { enroll, isPending: createOrder.isPending || verify.isPending };
};

export const useWishlistStatus = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: ['wishlistStatus', courseId],
    queryFn: () => courseServices.fetchWishlistStatus(courseId),
    enabled: !!courseId && enabled,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseServices.toggleWishlist(courseId),
    onSuccess: (data, courseId) => {
      toast.success(data?.message ?? 'Wishlist Updated.');
      queryClient.setQueryData(['wishlistStatus', courseId], (old: any) => ({
        ...(old ?? {}),
        isWishlisted: data.isWishlisted,
      }));
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error: any) => {
      toast.error('Wishlist Update Failed.', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    },
  });
};

export const useCourseProgress = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: () => courseServices.fetchCourseProgress(courseId),
    enabled: !!courseId && enabled,
  });
};

export const useToggleChapterComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, chapterIndex }: { courseId: string; chapterIndex: number }) =>
      courseServices.toggleChapterProgress(courseId, chapterIndex),
    onSuccess: (data, { courseId }) => {
      toast.success('Chapter Progress Updated!', {
        description: 'Your scholarly advancement has been recorded.',
      });
      queryClient.setQueryData(['courseProgress', courseId], data);
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] });
    },
    onError: (error: any) => {
      toast.error('Progress Update Failed.', {
        description:
          error?.response?.data?.message ||
          error?.message ||
          'A complication has arisen. Pray, try again.',
      });
    },
  });
};
