import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import apiClient from '@/lib/api/client';

interface User { id: string; email: string; token?: string }
interface AuthState { user: User | null; loading: boolean; error: string | null; isAuthenticated: boolean }
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => void;
}

export function useBetterAuth(): AuthContextType {
  const router = useRouter();

  const signInHandler = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/auth/signin', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        router.push('/tasks');
      } else throw new Error('Sign in failed - no token received');
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Sign in failed';
      throw new Error(message);
    }
  }, [router]);

  const signUpHandler = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/auth/signup', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        router.push('/tasks');
      } else throw new Error('Sign up failed - no token received');
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Sign up failed';
      throw new Error(message);
    }
  }, [router]);

  const signOutHandler = useCallback(async () => {
    try { localStorage.removeItem('access_token'); router.push('/signin'); }
    catch { router.push('/signin'); }
  }, [router]);

  const refreshAuth = useCallback(() => {}, []);

  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    signIn: signInHandler,
    signUp: signUpHandler,
    signOut: signOutHandler,
    refreshAuth,
  };
}