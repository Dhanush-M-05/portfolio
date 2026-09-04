import axios from 'axios';

// Base API URL pointing to the Node.js Express backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to automatically attach JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('portfolio_auth_token') ||
      sessionStorage.getItem('portfolio_auth_token') ||
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token') ||
      localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Automatically remove Content-Type header if sending FormData
    // allowing the browser to set multipart/form-data with proper boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('portfolio_auth_token');
      sessionStorage.removeItem('portfolio_auth_token');
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  }
);

export default api;
