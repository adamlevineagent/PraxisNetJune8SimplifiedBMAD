'use client';

import { useState } from 'react';
import { AuthService } from '../lib/auth-service';

interface AdminAuthState {
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    setState({ isLoading: true, error: null });
    
    try {
      const result = await AuthService.adminLogin(email, password);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login failed';
      setState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    AuthService.adminLogout();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const isAuthenticated = () => {
    return AuthService.isAdminAuthenticated();
  };

  const getAdmin = () => {
    return AuthService.getAdmin();
  };

  return {
    state,
    login,
    logout,
    clearError,
    isAuthenticated,
    getAdmin,
  };
}