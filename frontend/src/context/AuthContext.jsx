import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(() => {
    const saved = localStorage.getItem('fitzone_member');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('fitzone_token') || null;
  });
  const [loading, setLoading] = useState(false);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('fitzone_token', token);
    } else {
      localStorage.removeItem('fitzone_token');
    }
  }, [token]);

  // Sync member changes to localStorage
  useEffect(() => {
    if (member) {
      localStorage.setItem('fitzone_member', JSON.stringify(member));
    } else {
      localStorage.removeItem('fitzone_member');
    }
  }, [member]);

  /**
   * Login function
   */
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      if (response.success && response.token) {
        setToken(response.token);
        setMember(response.member);
        return { success: true, member: response.member };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    setToken(null);
    setMember(null);
    localStorage.removeItem('fitzone_token');
    localStorage.removeItem('fitzone_member');
  };

  const value = {
    member,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!member,
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
