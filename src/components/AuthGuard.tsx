import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../config/config';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to handle authentication and session persistence
 * Checks for valid tokens and redirects accordingly
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Only check authentication for admin routes
    if (!location.pathname.startsWith('/admin')) {
      // Not an admin route, don't do anything
      return;
    }
    
    // Don't redirect if already on login page
    if (location.pathname === '/admin/login') {
      return;
    }
    
    console.log('AuthGuard: Checking admin route authentication for:', location.pathname);
    
    const checkAuth = () => {
      const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
      const tokenExpiry = localStorage.getItem(config.auth.tokenExpiryKey);
      
      // If no token exists, redirect to login
      if (!accessToken) {
        console.log('AuthGuard: No access token found, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      // Check if token is expired (if remember me was used)
      if (tokenExpiry) {
        const expiryDate = new Date(tokenExpiry);
        if (expiryDate < new Date()) {
          // Token expired
          console.log('AuthGuard: Token expired, redirecting to login');
          localStorage.removeItem(config.auth.tokenStorageKey);
          localStorage.removeItem(config.auth.tokenExpiryKey);
          navigate('/admin/login');
          return;
        }
        
        // Token valid, and we're not on dashboard, redirect to dashboard if admin path
        if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/dashboard') {
          navigate('/admin/dashboard');
        }
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname]);
  
  return <>{children}</>;
};

export default AuthGuard;
