import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { authServices } from '../../services/authServices';
import type { AppDispatch } from '../../app/store';
import { toast } from 'sonner';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelect = () => useSelector;

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
      toast.error('Entry Denied.', {
        description: error?.response?.data?.message || 'Something went wrong!',
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
      toast.error('Registration failed. Pray, try again with a different moniker or email.', {
        description:
          error?.response?.data?.message || error?.message || 'An Unknown Error Occurred!',
      });
    },
  });
};
