import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { authServices } from '../../services/authServices';
import type { AppDispatch } from '../../app/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelect = () => useSelector;

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.login,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));

      navigate('/');
    },
    onError: (error) => {
      console.error('Courtyard access denied:', error.message);
      alert('Invalid credentials. Please try again.');
    },
  });
};
