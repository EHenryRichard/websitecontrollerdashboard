import axios from 'axios';

// Token management - updated by AuthProvider
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
};

export const getAuthToken = () => currentToken;

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Enables httpOnly cookie sending
});

// Request interceptor: Add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Log errors for debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('Network error - no response received');
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
