import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import config from '../config/config';

// Use mock login feature flag from config
const USE_MOCK_LOGIN = config.features.useMockData;

// Function to check if the user is already logged in
const checkExistingSession = () => {
  const accessToken = localStorage.getItem(config.auth.tokenStorageKey);
  const tokenExpiry = localStorage.getItem(config.auth.tokenExpiryKey);
  
  if (accessToken && tokenExpiry) {
    const expiryDate = new Date(tokenExpiry);
    if (expiryDate > new Date()) {
      console.log('Valid token found, expiry:', expiryDate.toLocaleString());
      return true;
    } else {
      console.log('Token expired at:', expiryDate.toLocaleString());
      // Clear expired tokens
      localStorage.removeItem(config.auth.tokenStorageKey);
      localStorage.removeItem(config.auth.tokenExpiryKey);
    }
  }
  
  return false;
};

// Mock response for testing
const MOCK_LOGIN_RESPONSE = {
  status: "success",
  message: "Admin login successful",
  data: {
    admin: {
      _id: "6737ab0a645a90de3fbb1a",
      email: "syedsalman186org@gmail.com",
      name: "Syed Salman",
      role: "Admin"
    },
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN5ZWQgU2FsbWFuIiwicm9sZSI6IkFkbWluIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    refreshToken: "mockRefreshToken123"
  }
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // Default to true for better UX
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check session
  
  const navigate = useNavigate();
  
  // Check for existing session on component mount
  useEffect(() => {
    if (checkExistingSession()) {
      // Already logged in, redirect to dashboard
      navigate('/admin/dashboard');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Use mock login if USE_MOCK_LOGIN is true
    if (USE_MOCK_LOGIN) {
      console.log('Using mock login data for testing');
      
      // Simple validation for demo
      if (email.trim() === '' || password.trim() === '') {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }
      
      // Simulate API delay
      setTimeout(() => {
        try {
          // Store tokens from mock data
          localStorage.setItem(config.auth.tokenStorageKey, MOCK_LOGIN_RESPONSE.data.accessToken);
          
          // Set expiry based on rememberMe setting
          const expiryDate = new Date();
          if (rememberMe) {
            // If rememberMe is checked, set an expiry for 30 days
            expiryDate.setDate(expiryDate.getDate() + config.auth.defaultTokenExpiry);
          } else {
            // If not, set a short session (8 hours)
            expiryDate.setHours(expiryDate.getHours() + 8);
          }
          
          // Always store expiry date
          localStorage.setItem(config.auth.tokenExpiryKey, expiryDate.toString());
          console.log('Mock token will expire at:', expiryDate.toLocaleString());
          
          console.log('Mock login successful, redirecting to dashboard');
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        } catch (mockError) {
          console.error('Error in mock login:', mockError);
          setError('An unexpected error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 1000); // 1 second delay to simulate network
      
      return;
    }
    
    // Real API implementation
    try {
      try {
        console.log('Attempting to login with:', { email });
        const response = await fetch(`${config.api.baseUrl}${config.api.auth.admin.login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        console.log('Login response status:', response.status);
        
        if (response.ok) {
          // Log the token for debugging (only first few characters)
          const tokenPreview = data.data.accessToken.substring(0, 15) + '...';
          console.log('Received token (preview):', tokenPreview);
          
          // Store tokens
          localStorage.setItem(config.auth.tokenStorageKey, data.data.accessToken);
          
          // Set expiry based on rememberMe setting
          const expiryDate = new Date();
          if (rememberMe) {
            // If rememberMe is checked, set an expiry for 30 days
            expiryDate.setDate(expiryDate.getDate() + config.auth.defaultTokenExpiry);
          } else {
            // If not, set a short session (8 hours)
            expiryDate.setHours(expiryDate.getHours() + 8);
          }
          
          // Always store expiry date
          localStorage.setItem(config.auth.tokenExpiryKey, expiryDate.toString());
          console.log('Token will expire at:', expiryDate.toLocaleString());
          
          // Trigger image endpoint
          try {
            await fetch(`${config.api.baseUrl}${config.api.auth.admin.loginImage}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${data.data.accessToken}`
              }
            });
          } catch (imageError) {
            console.error('Image endpoint error:', imageError);
            // Continue with login flow even if image endpoint fails
          }
          
          // Redirect to admin dashboard
          navigate('/admin/dashboard');
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (fetchError) {
        console.error('API connection error:', fetchError);
        
        // If API is not available, use mock login as fallback for testing
        console.log('API unavailable, falling back to mock login');
        localStorage.setItem(config.auth.tokenStorageKey, MOCK_LOGIN_RESPONSE.data.accessToken);
        
        if (rememberMe) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + config.auth.defaultTokenExpiry);
          localStorage.setItem(config.auth.tokenExpiryKey, expiryDate.toString());
        }
        
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Unexpected login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-dokirana-primary text-center mb-6">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dokirana-primary"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-dokirana-primary focus:ring-dokirana-primary border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
              Remember me for 30 days
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-dokirana-primary text-white py-2 px-4 rounded-md hover:bg-dokirana-secondary transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
