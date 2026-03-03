// T028: Sign in page with SignInForm and navigation links

import React from 'react';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#EDEEF3] space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#EDEEF3]">Sign In</h2>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          Welcome back! Sign in to manage your tasks.
        </p>
      </div>

      <SignInForm />

      <div className="text-center text-sm">
        <span className="text-[#9CA3AF]">Don't have an account? </span>
        <Link
          href="/signup"
          className="font-medium text-[#A78BFA] hover:bg-[#A78BFA]/10 px-2 py-1 rounded-lg transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
