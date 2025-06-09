'use client';

import { useState } from 'react';
import { AuthService, RegistrationData } from '../lib/auth-service';

export interface RegistrationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseRegistrationReturn {
  state: RegistrationState;
  register: (data: RegistrationData) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useRegistration(): UseRegistrationReturn {
  const [state, setState] = useState<RegistrationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const register = async (data: RegistrationData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.register(data);
      setState(prev => ({ ...prev, isLoading: false, success: true }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        success: false 
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      success: false,
    });
  };

  return {
    state,
    register,
    clearError,
    reset,
  };
}