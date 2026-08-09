import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { toast } from 'sonner';

const RequireAuth = () => {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (token) {
      warnedRef.current = false;
      return;
    }
    if (!warnedRef.current) {
      warnedRef.current = true;
      toast.info('Entrance Restricted.', {
        description: 'Please sign in or register to access the Courtyard.',
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
