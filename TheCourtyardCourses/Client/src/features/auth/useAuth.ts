import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { setCredentials, logout } from './authSlice';
import { authServices } from '../../services/authServices';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.login,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Welcome Back to the Courtyard!', {
        description: 'Your Presence Has Been Noted.',
      });
      navigate('/');
    },
    onError: (error) => {
      console.error('Courtyard access denied:', error.message);
      const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
      toast.error('Entry Denied.', {
        description: message || 'Something went wrong!',
      });
    },
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.register,
    onSuccess: (data) => {
      toast.success('Welcome to the Courtyard!', {
        description: 'Your Enrollment is Complete.',
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onError: (error) => {
      console.error('Courtyard access denied:', error.message);
      const message =
        (error as AxiosError<{ message?: string }>).response?.data?.message || error?.message;
      toast.error('Registration failed. Pray, try again with a different moniker or email.', {
        description: message || 'An Unknown Error Occurred!',
      });
    },
  });
};

export const useFetchMyProfile = () => {
  const token = useAppSelector((state) => state.auth.token);
  return useQuery({ queryKey: ['user'], queryFn: authServices.fetchMyProfile, enabled: !!token });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError, { username: string; formData: FormData }>({
    mutationFn: ({ username, formData }) => authServices.updateProfile(username, formData),
    onSuccess: () => {
      toast.success('Profile Updated!', {
        description: 'Your Details Have Been Inscribed Anew.',
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Profile update failed:', error.message);
      const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
      toast.error('Profile Update Failed.', {
        description: message || 'Something went wrong!',
      });
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    dispatch(logout());
    queryClient.removeQueries({ queryKey: ['user'] });

    toast.success('Departed the Courtyard.', {
      description: 'Your session has been safely closed.',
    });
  };
};

export const useFetchProfile = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => authServices.fetchProfile(username),
    enabled: !!username,
  });
};

export const useFetchWishlist = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['wishlist'],
    queryFn: ({ pageParam = 1 }) => authServices.fetchMyWishlist(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    enabled,
  });
};
