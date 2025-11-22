'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance, { setAuthToken } from '../utils/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  //Access token stored in memory only
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //initialize: try to get a new access token using refresh token
  useEffect(() => {
    refreshAccessToken();
  }, []);

  // 🔄 Refresh access token using HTTP-only cookie
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}users/refresh-token`,
        {},
        {
          withCredentials: true, // Sends HTTP-only cookie automatically
        }
      );

      // Store new access token in memory
      setAccessToken(response.data.data.accessToken);
      setAuthToken(response.data.data.accessToken); // Update axios instance
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Refresh token invalid/expired
      setAccessToken(null);
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Login function - sends magic login email
  const login = async (email, password) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}users/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Login endpoint only sends a magic link email, doesn't return tokens
      // User must click the magic link to complete authentication
      return true;
    } catch (error) {
      // Extract error message from axios error
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  // 🪄 Magic login function - called when verifying login token from email
  const magicLogin = async (validationId) => {
    try {
      // Verify the magic login link - this returns access token and sets HTTP-only refresh token cookie
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}users/login-verify/${validationId}`,
        {
          withCredentials: true, // IMPORTANT: Allows server to set HTTP-only refresh token cookie
        }
      );

      // Extract token and user from response (backend returns it in data.data structure)
      const accessToken = response.data?.data?.accessToken || response.data?.accessToken;
      const user = response.data?.data?.user || response.data?.user;

      // Store access token in memory and axios instance
      setAccessToken(accessToken);
      setAuthToken(accessToken);
      setUser(user);

      // Refresh token is automatically stored in HTTP-only cookie by server
      return response.data;
    } catch (error) {
      // Extract error message from axios error
      const errorMessage = error.response?.data?.message || error.message || 'Magic login failed';
      throw new Error(errorMessage);
    }
  };

  // 🚪 Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear HTTP-only cookie
      // Using axiosInstance to automatically include access token in Authorization header
      await axiosInstance.post('users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear access token from memory
      setAccessToken(null);
      setAuthToken(null);
      setUser(null);
      router.push('/auth/login');
    }
  };

  // ⏰ Auto-refresh token before expiry (14 minutes for 15min token)
  useEffect(() => {
    if (!accessToken) return;

    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  const value = {
    accessToken,
    user,
    isLoading,
    login,
    magicLogin,
    logout,
    refreshAccessToken,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
