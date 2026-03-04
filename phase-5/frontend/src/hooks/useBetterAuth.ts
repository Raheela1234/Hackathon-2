// hooks/useBetterAuth.ts
import { useCallback } from 'react';
import apiClient from '@/lib/api/client';

// Define the return type for signIn/signUp
interface AuthResponse {
  access_token: string;
}

export function useBetterAuth() {
  // Sign In
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/auth/signin', { email, password });

      if (!response.data.access_token) {
        throw new Error('Sign in failed - no token received');
      }

      // ✅ Return token for AuthContext to handle state
      return { access_token: response.data.access_token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Sign in failed';
      throw new Error(errorMessage);
    }
  }, []);

  // Sign Up
  const signUp = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/auth/signup', { email, password });

      if (!response.data.access_token) {
        throw new Error('Sign up failed - no token received');
      }

      return { access_token: response.data.access_token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Sign up failed';
      throw new Error(errorMessage);
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  // Optional refreshAuth (JWT-only)
  const refreshAuth = useCallback(() => {
    // Could implement refresh token logic if needed
  }, []);

  return { signIn, signUp, signOut, refreshAuth };
}