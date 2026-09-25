import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Synchronize authentication session with backend on initial app mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      const currentUser = data?.user || (data?.id ? data : null);
      setUser(currentUser);
      setAuthError(null);
    } catch (err) {
      // If 401 or no valid cookie/token, user is guest; this is expected behavior for unauthenticated visitors
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authService.login(credentials);
      const loggedUser = data?.user || (data?.id ? data : null);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      const registeredUser = data?.user || (data?.id ? data : null);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      setUser(null);
      setAuthError(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateUser,
    refreshUser: checkAuthStatus
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
