import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { toast } from 'sonner';
import UnauthorizedPage from '../system/UnauthorizedPage';

const RequireAuth = () => {
  const token = useAppSelector((state) => state.auth.token);
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
    return <UnauthorizedPage />;
  }

  return <Outlet />;
};

export default RequireAuth;
