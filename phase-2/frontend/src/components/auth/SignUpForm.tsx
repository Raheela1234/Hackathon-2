// T026: SignUpForm component with validation and confirm password

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateEmail, validatePassword } from '@/lib/utils/validation';
import { Button } from '../ui/Button';
import { SignUpFormState } from '@/types/auth';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { signUp } = useAuth();
  const [formState, setFormState] = useState<SignUpFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    errors: {},
    touched: {
      email: false,
      password: false,
      confirmPassword: false,
    },
    isSubmitting: false,
  });

  const handleBlur = (field: keyof typeof formState.touched) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));
    validateField(field, formState[field as keyof Pick<typeof formState, 'email' | 'password' | 'confirmPassword'>]);
  };

  const validateField = (
    field: keyof typeof formState.touched,
    value: string
  ) => {
    const errors = { ...formState.errors };

    if (field === 'email') {
      if (!value) {
        errors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        errors.email = 'Invalid email format';
      } else {
        delete errors.email;
      }
    }

    if (field === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else {
        const validation = validatePassword(value);
        if (!validation.valid) {
          errors.password = validation.errors[0];
        } else {
          delete errors.password;
        }
      }
    }

    if (field === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (value !== formState.password) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        delete errors.confirmPassword;
      }
    }

    setFormState((prev) => ({ ...prev, errors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFormState((prev) => ({
      ...prev,
      touched: { email: true, password: true, confirmPassword: true },
    }));

    // Validate all fields
    const errors: typeof formState.errors = {};

    if (!formState.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formState.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formState.password) {
      errors.password = 'Password is required';
    } else {
      const validation = validatePassword(formState.password);
      if (!validation.valid) {
        errors.password = validation.errors[0];
      }
    }

    if (!formState.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formState.confirmPassword !== formState.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      setFormState((prev) => ({ ...prev, isSubmitting: true, errors: {} }));
      await signUp(formState.email, formState.password);
      onSuccess?.();
    } catch (error: any) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { general: error.message || 'Sign up failed. Email may already exist.' },
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {formState.errors.general && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-400">{formState.errors.general}</p>
          </div>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-900">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            onBlur={() => handleBlur('email')}
            disabled={formState.isSubmitting}
            className={`
              w-full pl-10 pr-4 py-3 
              bg-white/5 backdrop-blur-sm
              border ${formState.touched.email && formState.errors.email ? 'border-red-500/50' : 'border-white/10'}
              rounded-xl
              text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
            placeholder="Enter your email"
          />
        </div>
        {formState.touched.email && formState.errors.email && (
          <p className="text-sm text-red-400 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formState.errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type="password"
            value={formState.password}
            onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
            onBlur={() => handleBlur('password')}
            disabled={formState.isSubmitting}
            className={`
              w-full pl-10 pr-4 py-3 
              bg-white/5 backdrop-blur-sm
              border ${formState.touched.password && formState.errors.password ? 'border-red-500/50' : 'border-white/10'}
              rounded-xl
              text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
            placeholder="Enter your password"
          />
        </div>
        {formState.touched.password && formState.errors.password && (
          <p className="text-sm text-red-400 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formState.errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-900">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <input
            type="password"
            value={formState.confirmPassword}
            onChange={(e) => setFormState((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            onBlur={() => handleBlur('confirmPassword')}
            disabled={formState.isSubmitting}
            className={`
              w-full pl-10 pr-4 py-3 
              bg-white/5 backdrop-blur-sm
              border ${formState.touched.confirmPassword && formState.errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}
              rounded-xl
              text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
            placeholder="Confirm your password"
          />
        </div>
        {formState.touched.confirmPassword && formState.errors.confirmPassword && (
          <p className="text-sm text-red-400 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formState.errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <p className="text-xs text-gray-400 flex items-center">
          <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25"
        isLoading={formState.isSubmitting}
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating Account...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            Create Account
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </Button>
    </form>
  );
}