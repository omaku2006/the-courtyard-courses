import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from './authSlice';
import { authServices } from '../../services/authServices';

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authServices.login,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/');
    },
    onError: (error) => {
      console.error('Courtyard access denied:', error.response?.data?.message || error.message);
      alert('Invalid credentials. Please try again.');
    },
  });
};
