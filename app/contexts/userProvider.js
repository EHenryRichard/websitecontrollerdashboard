'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthProvider';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('users');
      setUserDetails(res.data?.data || res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !userDetails) {
      fetchUserDetails();
    }

    if (!isAuthenticated) {
      setUserDetails(null);
    }
  }, [isAuthenticated]);

  const value = {
    userDetails,
    isLoading,
    error,
    fetchUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
