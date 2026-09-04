import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken =
          localStorage.getItem('portfolio_auth_token') ||
          sessionStorage.getItem('portfolio_auth_token') ||
          localStorage.getItem('admin_token') ||
          sessionStorage.getItem('admin_token') ||
          localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const currentUser = await getCurrentAdmin();
          setAdmin(currentUser);
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async ({ usernameOrEmail, password, rememberMe }) => {
    setIsLoading(true);
    try {
      const result = await loginAdmin({ usernameOrEmail, password, rememberMe });
      setAdmin(result.user);
      setToken(result.token);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
      setToken(null);
    }
  };

  const value = {
    admin,
    token,
    isAuthenticated: Boolean(token && admin),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
