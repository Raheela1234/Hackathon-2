'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SignInForm } from '@/components/auth/SignInForm';

export default function SignInPageContent() {
  const searchParams = useSearchParams();
  const justSignedOut = searchParams.get('justSignedOut') === 'true';

  return (
    <div className="space-y-6 max-w-md mx-auto mt-20 p-6 bg-gray-800/50 rounded-lg shadow-lg">
      {justSignedOut && (
        <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-4 rounded-lg">
          <p>You have successfully signed out.</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white/90">Sign In</h2>
        <p className="mt-2 text-sm text-white/80">
          Welcome back! Sign in to manage your tasks.
        </p>
      </div>

      <SignInForm />

      <div className="text-center text-sm text-white/80">
        <span>{`Don't have an account? `}</span>
        <Link
          href="/signup"
          className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
