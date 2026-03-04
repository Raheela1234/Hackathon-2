'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthState, AuthContextType } from '@/types/auth';
import { useBetterAuth } from '@/hooks/useBetterAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const authHook = useBetterAuth();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  // Initial token check
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      const decoded = parseJwt(token);
      if (decoded) {
        setAuthState({
          user: { id: decoded.sub, email: decoded.email, token },
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }
    }
  }, []);

  // Sign In
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authHook.signIn(email, password);
      const token = response.access_token;
      localStorage.setItem('access_token', token);
      const decoded = parseJwt(token);
      if (!decoded) throw new Error('Invalid token');

      setAuthState({
        user: { id: decoded.sub, email: decoded.email, token },
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      router.push('/tasks');
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'Sign in failed',
        isAuthenticated: false,
      });
      throw error;
    }
  };

  // Sign Out with 2s loader + redirect
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true })); // start loader

    // wait 2 seconds
    setTimeout(async () => {
      try {
        await authHook.signOut();
      } catch {
        // ignore
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      router.push('/?justSignedOut=true'); // redirect to landing page with flag
    }, 2000);
  };

  // Sign Up
  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authHook.signUp(email, password);
      const token = response.access_token;
      localStorage.setItem('access_token', token);
      const decoded = parseJwt(token);
      if (!decoded) throw new Error('Invalid token');

      setAuthState({
        user: { id: decoded.sub, email: decoded.email, token },
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      router.push('/tasks');
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.message || 'Sign up failed',
        isAuthenticated: false,
      });
      throw error;
    }
  };

  // Refresh Auth
  const refreshAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      const decoded = parseJwt(token);
      if (decoded) {
        setAuthState({
          user: { id: decoded.sub, email: decoded.email, token },
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      }
    } else {
      localStorage.removeItem('access_token');
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthContextProvider');
  return context;
}