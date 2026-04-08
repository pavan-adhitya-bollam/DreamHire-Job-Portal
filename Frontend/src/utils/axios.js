import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Send cookies with all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle token refresh if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on login page and this is not the initial auth check
      if (window.location.pathname !== '/login' && !error.config.url.includes('/user/me')) {
        console.warn('Authentication failed - checking if redirect needed');
        
        // Check if this is a protected route that requires login
        const protectedRoutes = ['/profile', '/admin', '/jobs/'];
        const isProtectedRoute = protectedRoutes.some(route => window.location.pathname.startsWith(route));
        
        if (isProtectedRoute) {
          console.warn('User was on protected route, redirecting to login');
          // Clear user from Redux store
          import('@/redux/authSlice').then(({ setUser }) => {
            import('@/redux/store.js').then((store) => {
              store.default.dispatch(setUser(null));
            });
          });
          // Redirect to login
          window.location.href = '/login';
        } else {
          console.warn('User was on public route, not redirecting');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
