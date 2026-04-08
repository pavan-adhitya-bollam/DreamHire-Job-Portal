import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import api from '@/utils/axios';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    // Only fetch user if not already loaded
    if (!user) {
      const initializeAuth = async () => {
        try {
          const res = await api.get(`/user/me`);
          
          if (res.data.success && res.data.user) {
            dispatch(setUser(res.data.user));
            console.log('✅ User initialized from token:', res.data.user.email);
          }
        } catch (error) {
          console.log('ℹ️ No valid token found, user needs to login');
          // Don't dispatch setUser(null) as this might clear legitimate state
        }
      };

      initializeAuth();
    }
  }, [user, dispatch]);

  return { user };
};
